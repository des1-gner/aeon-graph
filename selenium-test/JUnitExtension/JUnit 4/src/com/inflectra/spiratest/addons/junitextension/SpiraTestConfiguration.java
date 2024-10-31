package com.inflectra.spiratest.addons.junitextension;

import java.lang.annotation.*;

/**
 * This defines the 'SpiraTestConfiguration' annotation used to specify the authentication,
 * project and release information for the test being executed
 * 
 * @author		Inflectra Corporation
 * @version		3.0.1
 *
 */
@Retention(value=java.lang.annotation.RetentionPolicy.RUNTIME)
@Target(value=java.lang.annotation.ElementType.TYPE)
public @interface SpiraTestConfiguration
{
	String url ();
	String login () default "";
	String password () default "";
	int projectId () default -1;
	int releaseId () default -1;
	int testSetId () default -1;
}
