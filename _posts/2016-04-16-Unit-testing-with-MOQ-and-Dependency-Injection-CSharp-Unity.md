---
title: Unit testing with MOQ and Dependency Injection - C#, Unity.Mvc5
author: Leszek
layout: post
permalink: /Unit-testing-with-MOQ-and-Dependency-Injection-CSharp-Unity
path: 2016-04-16-Unit-testing-with-MOQ-and-Dependency-Injection-CSharp-Unity.md
---

Both of the C# projects I have worked on recently used [MOQ](//github.com/Moq/moq4) for .NET to mock various resources in unit tests.  One thing that also helped in those unit tests was [Unity.Mvc5](//github.com/devtrends/Unity.Mvc5) and its Dependency Injection.

I want to say I followed [Dhananjay Kumar's blog post](//debugmode.net/2014/08/28/resolving-dependencies-in-asp-net-mvc-5-using-unity-container/) to get Unity setup and even though the post was from 2014 it worked without any issues.

First I decided to test the service layer.  I created an interface 

``` csharp
public interface IOrderService
{
	List<ingredient> GetIngredients();
}
```

and a class implementing this interface.

``` csharp
public class OrderService : IOrderService
{
	public IOrderRepository repository;

	public OrderService(IOrderRepository repository)
	{
		this.repository = repository;
	}

	public List<ingredient> GetIngredients()
	{
		try
		{
			return repository.GetIngredients();
		}
		catch (Exception ex)
		{
			throw ex;
		}
	}
}
```

I'm sure there are better ways of handling exceptions, but for the purpose of this tutorial we want to focus on MOQ and DI.  

In the above example we are injecting `OrderRepository` into the service and then we are calling its `GetIngredients` method within the `try` block.  In order to be able to create a mock repository, we need to know what the `GetIngredients` method in `OrderRepository` returns and create that object within the test.

Finally we are able to write a unit test inside of a test class.  You generally want to create a separate project for your unit tests.  If you are using Visual Studio 2015 you can read more about "Create Unit Tests" feature [here](//blogs.msdn.microsoft.com/visualstudioalm/2015/03/06/creating-unit-test-method-stubs-with-create-unit-tests/).

``` csharp
[TestClass()]
public class OrderServiceTests
{
	[TestMethod()]
	public void GetIngredientsTest_AreEqual()
	{
		ingredient cheese = new ingredient()
		{
			ingredientid = 1,
			name = "Cheese",
			price = 2
		};

		List<ingredient> ingredients = new List<ingredient>();
		ingredients.Add(cheese);

		Mock<IOrderRepository> mockRepository = new Mock<IOrderRepository>();
		mockRepository.Setup(s => s.GetIngredients()).Returns(() => ingredients);

		OrderService orderService = new OrderService(mockRepository.Object);

		List<ingredient> resultIngredients = orderService.GetIngredients();

		Assert.AreEqual(ingredients, resultIngredients);
	}
}
```

In above example we create a mock repository and use the `Setup` method which returns a static object when `GetIngredients` method is called.  Since we are testing the OrderService class and not the repository, we don't care about thesting the logic of the repository method. We then instantiate `OrderService` and inject our mock repository.  Once that is done all we have left is to call the service method we are testing and `Assert` that whatever the mock repository retuns is equal to what our real service method returned.