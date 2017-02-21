---
title: How to dynamically build helper classes using SCSS
author: Leszek Zychowski
layout: post
permalink: /SCSS-repeated-helper-classes-with-5px-increment
path: 2017-02-17-SCSS-repeated-helper-classes-with-5px-increment.md
---

## Introduction

One of the things I begin every front-end project with is a setup of basic CSS and various reusable helper classes.  Today I went back to clean up few different inline CSS styles and replaced them with classes.  One of most widely used helper CSS properties are `padding` and `margin`.  Given that the values for those properties can range based on the layout, it is almost inevitable that at some point in time you will have a class for every direction and size.
  
For example:

``` css
.padding-0-left {
	padding-left: 0;
}

.padding-5-left {
	padding-left: 5px;
}

.padding-10-left {
	padding-left: 10px;
}
```

After a while this list can grow and can be hard to maintain if any changes need to be made.  At some point in time you might be required to modify the name pattern or even adjust the value by 1 unit.  The direction I chose was using SCSS to generate all my classes from variables and lists.

## SCSS loop

First step was to create a simple loop that would output multiple classes with the following format:

``` scss
@for $i from 0 to 10 {
	.padding-#{$i}-left {
		padding-left: $i + px;
	}
}
```

The `@for` loop syntax is `@for $index from $starting_value to $ending_value { ... }` and as used above it generates:

``` css
.padding-0-left {
	padding-left: 0px;
}

.padding-1-left {
	padding-left: 1px;
}
```

We can immediately see what a lot of developers try to avoid, unit type `px` after the value of `0`.  While there isn't a noted performance increase and the unit type is optional, it is a common practice to not include unit types with value of `0`.

## SCSS function with if statement

What we can do is create a generic function that will accept `$value` and `$unit` and return both if `$value` is not `0`, otherwise `0` will be returned.  To accomplish this we have used an inline `if` statement which uses the following syntax `if(condition, true, false)`.

``` scss
@function add-unit-to-value($value, $unit){
	@return if($value != 0, $value + $unit, 0);
}
```

We can then combine it with our loop to cleanup the resulting CSS.

``` scss
@function add-unit-to-value($value, $unit){
	@return if($value != 0, $value + $unit, 0);
}

@for $i from 0 to 10 {
	.padding-#{$i}-left {
		padding-left: add-unit-to-value($i, px);
	}
}
```

The resulting CSS is a bit cleaner.

``` css
.padding-0-left {
	padding-left: 0;
}

.padding-1-left {
	padding-left: 1px;
}
```

## Modify increment using a SCSS function

While the values for padding differ from page to page, our particular example is looking from values starting at `0` to `50` with a `5px` increment.  We can accomplish that by creating another function that will add `5` to each value of `$i`.

``` scss
@function increment-by-5($i, $unit){
	@return 0 + ($i * 5) + $unit;
}

@for $i from 0 to 10 {
	.padding-#{$i}-left {
		padding-left: increment-by-5($i, px);
	}
}
```

We want to make sure that we continue stripping out units from values of `0`, therefore we re-add `add-unit-to-value(...)` call.

``` scss
@function add-unit-to-value($value, $unit){
	@return if($value != 0, $value + $unit, 0);
}

@function increment-by-5($i, $unit){
	@return add-unit-to-value(0 + ($i * 5), $unit);
}

@for $i from 0 to 10 {
	.padding-#{$i}-left {
		padding-left: increment-by-5($i, px);
	}
}
```

The resulting CSS is:

``` css
.padding-0-left {
	padding-left: 0;
}

.padding-1-left {
	padding-left: 5px;
}

.padding-2-left {
	padding-left: 10px;
}
```

Last thing that is left is to adjust the class names as they no longer match the values of the `padding` property.

``` scss
@for $i from 0 to 10 {
	.padding-#{$i * 5}-left {
		padding-left: increment-by-5($i, px);
	}
}
```

We now get:

``` css
.padding-0-left {
	padding-left: 0;
}

.padding-5-left {
	padding-left: 5px;
}
```

Our SCSS looks like this:

``` scss
@function add-unit-to-value($value, $unit){
	@return if($value != 0, $value + $unit, 0);
}

@function increment-by-5($i, $unit){
	@return add-unit-to-value(0 + ($i * 5), $unit);
}

@for $i from 0 to 10 {
	.padding-#{$i * 5}-left {
		padding-left: increment-by-5($i, px);
	}
}
```

## Dynamic class and property names

What we want to do next is to generate both `padding` and `margin` classes for each side - top, right, left, and bottom.  We start by creating an SCSS list of keys and values.  This list will allow us to dynamically set the class name as well as property name and side.

``` scss
$repeatable-class-slugs: padding left, padding right, padding top, padding bottom, margin left, margin right, margin top, margin bottom;
```

Given that directions like `top`, `right`, `bottom`, and `left` are used for multiple CSS properties, we can set them as variables with short names.  We can also store `padding` and `margin` in short variables for later use.

``` scss
$l: left;
$r: right;
$t: top;
$b: bottom;
$pad: padding;
$mar: margin;

$repeatable-class-slugs: $pad $l, $pad $r, $pad $t, $pad $b, $mar $l, $mar $r, $mar $t, $mar $b;
```

Now that we have a list of keys and values, we can use it to modify our existing `@for` loop.  We will introduce a wrapper `@each` loop that will iterate over the list and dynamically build the class and property names.  We will also se the key and value to insert a CSS comment that will separate groups of classes.

``` scss
@each $slug in $repeatable-class-slugs {
    $key: nth($slug, 1);
    $value: nth($slug, 2);
    
    /* #{$slug} */
    
    @for $i from 0 through 10 {
    	.#{$key}-#{$i * 5}-#{$value} {
    		#{$key}-#{$value}: increment-by-5($i, px);
    	}
    }
}
```

The `@each` loop iterates over our list and for each iteration it declares two variables, `$key` and `$value` which are populated with class/property name and direction respectively.  Next a comment with the key and value is displayed. `$slug` is equivalent to a string of `"key value"`, therefore we don't need to write `/* #{$key} #{$value} */`.  Finally we execute the original loop that builds each class.

We can make one last modification to this code before we make it a generic reusable block of SCSS.  We will go ahead and shorten the direction in the CSS class name in order to reduce the amount of characters in the HTML.  Above code becomes:

``` scss
@each $slug in $repeatable-class-slugs {
    $key: nth($slug, 1);
    $value: nth($slug, 2);
    
    /* #{$slug} */
    
    @for $i from 0 through 10 {
    	.#{$key}-#{$i * 5}-#{str-slice($value, 0, 1)} {
    		#{$key}-#{$value}: increment-by-5($i, px);
    	}
    }
}
```

We have replaced `#{$value}` with `#{str-slice($value, 0, 1)}` by slicing off all characters of the string with exception of the first one.  CSS classes will be generated as such:

``` css
.padding-5-l {
	padding-left: 5px;
}

// hidden

.margin-5-t {
	margin-top: 5px;
}
```

    
## Mixins and reusability

Final step is to convert this loop into reusable code and replace hardcoded values.  In order to accomplish this we will wrap our loop structure into a `@mixin` that will accept our map of keys and values as well as values used in the loop control structure.

First thought would be to use a `@function`, but in SCSS the purpose of a `@function` is to return a value and not to hold logic.  `@mixin` is a reusable block of SCSS that takes arguments like a function and can contain control structures as well as CSS rules and other mixins.  

``` scss
@function add-unit-to-value($value, $unit){
	@return if($value != 0, $value + $unit, 0);
}

@function increment($i, $increment, $unit){
	@return add-unit-to-value(0 + ($i * $increment), $unit);
}

@mixin repeat-unit-classes-map($name-map, $start, $end, $increment, $unit){
    @each $slug in $name-map {
    	$key: nth($slug, 1);
    	$value: nth($slug, 2);
    
    	/* #{$slug} */
    
    	@for $i from $start through $end {
    		.#{$key}-#{$i * $increment}-#{str-slice($value, 0, 1)} {
    			#{$key}-#{$value}: increment($i, $increment, $unit);
    		}
    	}
    }
}
```

Inside of the mixin we proceed to replace target list in the `@each` loop, bounding values `0` and `10` of the inner `@for` loop, and the increment value of `5`.  We also modify the `increment-by-5(...)` function to accept an increment value and rename it to `increment(...)`.

We can tweak this mixin further by adding a default for the `$increment` parameter.  We will set the default increment to `1` and make it the last parameter of the mixin.  Parameters with default are considered optional and must be placed after required parameters.

``` scss
@mixin repeat-unit-classes-map($name-map, $start, $end, $unit, $increment: 1){
	// logic
}
```

## Conclusion

Our final SCSS looks like this:

``` scss
// variables

$l: left;
$r: right;
$t: top;
$b: bottom;
$pad: padding;
$mar: margin;

// map with keywords used to automate building of CSS class names and property names

$repeatable-slugs: $pad $l, $pad $r, $pad $t, $pad $b, $mar $l, $mar $r, $mar $t, $mar $b;

// helper functions

@function add-unit-to-value($value, $unit){
	@return if($value != 0, $value + $unit, 0);
}

@function increment($i, $increment, $unit){
	@return add-unit-to-value(0 + ($i * $increment), $unit);
}

// class generator mixin

@mixin repeat-unit-classes-map($name-map, $start, $end, $unit, $increment: 1){
	@each $slug in $name-map {
		$key: nth($slug, 1);
		$value: nth($slug, 2);

		/* #{$slug} */

		@for $i from $start through $end {
			.#{$key}-#{$i * $increment}-#{str-slice($value, 0, 1)} {
				#{$key}-#{$value}: increment($i, $increment, $unit);
			}
		}
	}
}
```

It can be executed by writing the following line of SCSS code anywhere you want to render your classes:

``` scss
@include repeat-unit-classes-map($repeatable-slugs, 0, 10, px, 5);
```

The resulting CSS looks like this:

``` css
/* padding left */

.padding-0-l {
	padding-left: 0;
}

.padding-5-l {
	padding-left: 5px;
}

// hidden

/* margin top */

.margin-0-t {
	margin-top: 0;
}

.margin-5-t {
	margin-top: 5px;
}
```
