package com.inflectra.spiratest.addons.junitextension;

import org.junit.runner.notification.*;
import org.junit.runner.*;

import java.lang.reflect.*;   
import java.util.*;

/**
 * Implements a test listener for a JUnit test execution. The connection
 * parameters for SpiraTeam as well as the test case, test set and release ids
 * are samples from Java annotations and can be overruled by constructor
 * arguments or properties.
 * 
 * @author		Inflectra Corporation
 * @version		3.0.1
 *
 */
public class SpiraTestListener extends RunListener
{
	static final String TEST_RUNNER_NAME = "JUnit";

	protected Vector<TestRun> testRunVector;
	private String url;
	private String userName;
	private String password;
	private Integer projectId;
	private Integer releaseId;
	private Integer testSetId;

	/**
	 * Name of URL property for SpiraTeam
	 */
	public static final String SPIRA_URL_PROPERTY = "spira.url";
	/**
	 * Name of user name property for SpiraTeam login
	 */
	public static final String SPIRA_USER_NAME_PROPERTY = "spira.login";
	/**
	 * Name of password property for SpiraTeam login
	 */
	public static final String SPIRA_PASSWORD_PROPERTY = "spira.password";
	/**
	 * Name of project id property for SpiraTeam login
	 */
	public static final String SPIRA_PROJECT_ID_PROPERTY = "spira.projectId";
	/**
	 * Name of release id property for SpiraTeam
	 */
	public static final String SPIRA_RELEASE_ID_PROPERTY = "spira.releaseId";
	/**
	 * Name of test set id property for SpiraTeam
	 */
	public static final String SPIRA_TEST_SET_ID_PROPERTY = "spira.testSetId";
	private static final String UNKNOWN_INT_PROPERTY = "0";

	
	/**
	 * Constructs a listener without properties
	 */
	public SpiraTestListener() {
		this(null, null, null, null, null, null);
	}

	/**
	 * Constructs a listener overriding the property release id only
	 * 
	 * @param releaseId
	 *            release id to be used with SpiraTeam
	 */
	public SpiraTestListener(Integer releaseId)
	{
		this(null, null, null, null, releaseId, null);
	}

	/**
	 * Constructs a listener overriding the properties.
	 * 
	 * @param props
	 *            Properties to be overruled
	 */
	public SpiraTestListener(final Properties props)
	{
		setUrl(props.getProperty(SPIRA_URL_PROPERTY));
		setUserName(props.getProperty(SPIRA_USER_NAME_PROPERTY));
		setPassword(props.getProperty(SPIRA_PASSWORD_PROPERTY));
		setProjectId(Integer.parseInt(props.getProperty(
				SPIRA_PROJECT_ID_PROPERTY, UNKNOWN_INT_PROPERTY)));
		setReleaseId(Integer.parseInt(props.getProperty(
				SPIRA_RELEASE_ID_PROPERTY, UNKNOWN_INT_PROPERTY)));
		setTestSetId(Integer.parseInt(props.getProperty(
				SPIRA_TEST_SET_ID_PROPERTY, UNKNOWN_INT_PROPERTY)));
	}

	/**
	 * Constructs a listener overriding all properties.
	 * 
	 * @param url URL to be used for SpiraTeam connection
	 * @param userName user name to be used for SpiraTeam login
	 * @param password password to be used for SpiraTeam login
	 * @param projectId project id to be used for SpiraTeam login
	 * @param releaseId release id to be used with SpiraTeam
	 * @param testSetId test set id to be used with SpiraTeam
	 */
	public SpiraTestListener(final String url, final String userName,
			final String password, Integer projectId, Integer releaseId, Integer testSetId)
	{
		setUrl(url);
		setUserName(userName);
		setPassword(password);
		setProjectId(projectId);
		setReleaseId(releaseId);
		setTestSetId(testSetId);
	}

	/**
	 * Sets URL for SpiraTeam connection
	 * 
	 * @param url URL to be used for SpiraTeam connection
	 */
	public void setUrl(String url)
	{
		this.url = url;
	}

	/**
	 * Sets user name for SpiraTeam connection
	 * 
	 * @param userName user name to be used for SpiraTeam login
	 */
	public void setUserName(String userName)
	{
		this.userName = userName;
	}

	/**
	 * Sets password for SpiraTeam connection
	 * 
	 * @param password password to be used for SpiraTeam login
	 */
	public void setPassword(String password)
	{
		this.password = password;
	}

	/**
	 * Sets project id for SpiraTeam connection
	 * 
	 * @param projectId project id to be used for SpiraTeam login
	 */
	public void setProjectId(Integer projectId)
	{
		this.projectId = projectId;
	}

	/**
	 * Sets release id for SpiraTeam connection
	 * 
	 * @param releaseId release id to be used with SpiraTeam
	 */
	public void setReleaseId(Integer releaseId)
	{
		this.releaseId = releaseId;
	}

	/**
	 * Sets test set id for SpiraTeam connection
	 * 
	 * @param testSetId test set id to be used with SpiraTeam
	 */
	public void setTestSetId(Integer testSetId)
	{
		this.testSetId = testSetId;
	}
	
	/**
	 * Logs a failure with SpiraTest whenever a unit test fails
	 * 
	 * @param failure	JUnit Failure object that describes the failed test
	 */
	public void testFailure(Failure failure)
	{
		//Extract the values out of the failure object
		String message = failure.getMessage();
		String stackTrace = failure.getTrace();
		String classAndMethod = failure.getTestHeader();

		//Handle the empty string case
		if (message.equals(""))
		{
			message = "No Message Available";
		}

		System.out.print ("Test Failed\n");
		System.out.print (message + "\n");
		System.out.print ("Stack Trace:\n" + stackTrace + "\n");

		//Create a new test run
		TestRun newTestRun = new TestRun();
		newTestRun.message = message;
		newTestRun.stackTrace = stackTrace;
		newTestRun.executionStatusId = 1;	//Failed
		newTestRun.testName = classAndMethod;

		//Populate the Test Run from the meta-data derived from 
		//the class/method name combination
		populateTestRun (classAndMethod, newTestRun, true);

		//See if this test case is already in the vector
		//since we cannot guarentee whether the testFailure or testFinished method is called first
		boolean found = false;
		for (int i = 0; i < testRunVector.size(); i++)
		{
			TestRun testRun = (TestRun) this.testRunVector.elementAt(i);
			if (testRun.testName.equals (newTestRun.testName))
			{
				//We simply need to update the item as a failure and add the appropriate data
				testRun.message = newTestRun.message;
				testRun.stackTrace = newTestRun.stackTrace;
				testRun.executionStatusId = newTestRun.executionStatusId;
				found = true;
			}
		}

		//Add it to the vector if we didn't find a match
		if (! found)
		{
			testRunVector.addElement (newTestRun);
		}
	}

	/**
	 * Logs an event with SpiraTest whenever a unit test is finished
	 * 
	 * @param description	JUnit Description object that describes the test just run
	 */
	public void testFinished (Description description)
	{
		//Extract the values out of the description object
		String classAndMethod = description.getDisplayName();

		//Add an entry to the list of test runs
		TestRun newTestRun = new TestRun();
		newTestRun.message = "Test Passed";
		newTestRun.stackTrace = "";
		newTestRun.executionStatusId = 2;	//Passed
		newTestRun.testName = description.getDisplayName();
		
		//Populate the Test Run from the meta-data derived from 
		//the class/method name combination
		populateTestRun (classAndMethod, newTestRun, false);

		//See if this test case is already in the vector
		//since we cannot guarentee whether the testFailure or testFinished method is called first
		boolean found = false;
		for (int i = 0; i < testRunVector.size(); i++)
		{
			TestRun testRun = (TestRun) this.testRunVector.elementAt(i);
			if (testRun.testName.equals(newTestRun.testName))
			{
				//Since a failure overrides a success, we can leave the data alone
				//and just mark it as found, to prevent the duplicate addition to the vector
				found = true;
			}
		}

		//Add it to the vector if we didn't find a match
		if (! found)
		{
			testRunVector.addElement (newTestRun);
		}
	}

	/**
	 * Called when the test run is started for a fixture
	 * 
	 * @param description	JUnit Description object that describes the tests to be run
	 */
	public void testRunStarted (Description description)
	{
		//Create a new vector of test runs
		this.testRunVector = new Vector<TestRun>();

		System.out.print ("Starting test run...\n\n");
	}

	/**
	 * Called when the test run is finished for a fixture
	 * 
	 * @param result	The summary of the test run, including all the tests that failed 
	 */
	public void testRunFinished (Result result)
	{
		System.out.print ("Test run finished with " + result.getFailureCount() + " Failures.\n\n");

		try
		{
			//Instantiate the web service proxy class
			SpiraTestExecute spiraTestExecute = new SpiraTestExecute();

			//Now we need to iterate through the vector and call the SpiraTest API to record the results
			//We need to record both passes and failures
			int successCount = 0;
			int errorCount = 0;
			for (int i = 0; i < this.testRunVector.size(); i++)
			{
				TestRun testRun = (TestRun) this.testRunVector.elementAt(i);
			
				//Get the current date/time
				Date now = new Date();

				//Populate the web service proxy with the connection info, then execute the API method
				spiraTestExecute.url = testRun.url;
				spiraTestExecute.userName = testRun.userName;
				spiraTestExecute.password = testRun.password;
				spiraTestExecute.projectId = testRun.projectId;
				int testRunId = spiraTestExecute.recordTestRun (
					null,
					testRun.testCaseId,
					(testRun.releaseId == -1) ? null : testRun.releaseId,
					(testRun.testSetId == -1) ? null : testRun.testSetId,
					now,
					now,
					testRun.executionStatusId,
					TEST_RUNNER_NAME,
					testRun.testName,
					1,
					testRun.message,
					testRun.stackTrace
					);
				if (testRunId == -1)
				{
					errorCount++;
				}
				else
				{
					successCount++;
				}
			}
			//Print out how many results transmitted successfully to SpiraTest
			System.out.print (successCount + " test results were successfully transmitted to SpiraTest (" + errorCount + " errors).\n\n");
		}
		catch(Exception e)
		{
			System.out.println(e);
		} 
	}

	/**
	 * Populates the test run object from the annotations associated with the test case (class and method)s
	 * 
	 * @param classAndMethod	The class and method name in the form 'method(class)'
	 * @param displayMessage	Should we display a message or not
	 * @param testRun		The test run object to be populated
	 */
	protected void populateTestRun (String classAndMethod, TestRun testRun, boolean displayMessage)
	{
		//Get the test class and test method names separately
		//The header contains "method(class)"
		String [] classAndMethodArray = classAndMethod.split ("[()]");
		String methodName = classAndMethodArray [0];
		String className = classAndMethodArray [1];

		//Now try and extract the metadata from the test case
		try
		{
			//Get a handle to the class and method
			Class<?> testClass = Class.forName(className);
			Method testMethod = testClass.getMethod(methodName);

			//Extract the SpiraTest test case id - if present
			if (testMethod.isAnnotationPresent(SpiraTestCase.class))
			{
				SpiraTestCase methodAnnotation = testMethod.getAnnotation (SpiraTestCase.class);
				testRun.testCaseId = methodAnnotation.testCaseId();
				if (displayMessage)
				{
					System.out.print ("Matches SpiraTest test case id: " + testRun.testCaseId + "\n\n");
				}
			}
			else
			{
				System.out.print ("SpiraTest Annotation not Found on method '" + methodName + "'!\n\n");
			}

			//Extract the SpiraTest configuration data - if present
			if (testClass.isAnnotationPresent(SpiraTestConfiguration.class))
			{
				SpiraTestConfiguration classAnnotation = testClass.getAnnotation (SpiraTestConfiguration.class);
				testRun.url = classAnnotation.url();
				testRun.userName = classAnnotation.login();
				testRun.password = classAnnotation.password();
				testRun.projectId = classAnnotation.projectId();
				testRun.releaseId = classAnnotation.releaseId();
				testRun.testSetId = classAnnotation.testSetId();
			}
			
			// overwrite the test configuration with the constructor call
			// parameters
			if (url != null && !url.isEmpty())
			{
				testRun.url = url;
			}
			if (userName != null && !userName.isEmpty())
			{
				testRun.userName = userName;
			}
			if (password != null && !password.isEmpty())
			{
				testRun.password = password;
			}
			if (projectId != null && projectId != 0)
			{
				testRun.projectId = projectId;
			}
			if (releaseId != null && releaseId != 0)
			{
				testRun.releaseId = releaseId;
			}
			if (testSetId != null && testSetId != 0)
			{
				testRun.testSetId = testSetId;
			}
			
			//Make sure we have a URL, login, password and project specified
			//(the rest are optional)
			if (testRun.url == null || testRun.url.isEmpty())
			{
				System.out.println("You need to specify a URL in either the class annotation or through the listener constructor");
			}
			if (testRun.userName == null || testRun.userName.isEmpty())
			{
				System.out.println("You need to specify a User Name in either the class annotation or through the listener constructor");
			}
			if (testRun.password == null || testRun.password.isEmpty())
			{
				System.out.println("You need to specify a Password in either the class annotation or through the listener constructor");
			}
			if (testRun.projectId < 1)
			{
				System.out.println("You need to specify a ProjectId in either the class annotation or through the listener constructor");
			}
		}
		catch(NoSuchMethodException e)
		{
			System.out.println(e);
		} 
		catch(ClassNotFoundException e)
		{
			System.out.println(e);
		} 
	}
}