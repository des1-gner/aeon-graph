package com.inflectra.spiratest.addons.junitextension.samples;

import static org.junit.Assert.*;
import junit.framework.JUnit4TestAdapter;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.*;
import com.inflectra.spiratest.addons.junitextension.*;

/**
 * Some simple tests using the ability to return results back to SpiraTest
 * 
 * @author		Inflectra Corporation
 * @version		3.0.0
 *
 */
@SpiraTestConfiguration(
	url="http://localhost/Spira",
	login="fredbloggs",
	password="fredbloggs",
	projectId=1,
	releaseId=1,
	testSetId=1
)
public class SimpleTest
{
	protected int fValue1;
	protected int fValue2;

	/**
	 * Sets up the unit test
	 */
	@Before
	public void setUp()
	{
		fValue1= 2;
		fValue2= 3;
	}

	/**
	 * Tests the addition of the two values
	 */
	@Test
	@SpiraTestCase(testCaseId=5)
	public void testAdd()
	{
		double result = fValue1 + fValue2;

		// forced failure result == 5
		assertTrue (result == 6);
	}

	/**
	 * Tests division by zero
	 */
	@Test
	@SpiraTestCase(testCaseId=5)
	public void testDivideByZero()
	{
		int zero = 0;
		int result = 8 / zero;
		result++; // avoid warning for not using result
	}

	/**
	 * Tests two equal values
	 */
	@Test
	@SpiraTestCase(testCaseId=6)
	public void testEquals()
	{
		assertEquals(12, 12);
		assertEquals(12L, 12L);
		assertEquals(new Long(12), new Long(12));

		assertEquals("Size", 12, 13);
		assertEquals("Capacity", 12.0, 11.99, 0.0);
	}

	/**
	 * Tests success
	 */
	@Test
	@SpiraTestCase(testCaseId=6)
	public void testSuccess()
	{
		//Successful test
		assertEquals(12, 12);
	}

	/**
	 * Entry point for command line execution
	 * 
	 * @param args	The command line arguments
	 */
	public static void main (String[] args)
	{
		//Instantiate the JUnit core
		JUnitCore core = new JUnitCore();

		//Add the custom SpiraTest listener
		core.addListener(new SpiraTestListener());

		//Finally run the test fixture
		core.run(SimpleTest.class);
	}

	/**
	 * Entry point for JUnit 4.x runners
	 * 
	 * @return		Handle to the test framework
	 */
	public static junit.framework.Test suite() 
	{
		return new JUnit4TestAdapter(SimpleTest.class);
	}
}