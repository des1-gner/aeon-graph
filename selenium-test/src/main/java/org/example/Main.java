package org.example;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.time.Duration;

// Press Shift twice to open the Search Everywhere dialog and type `show whitespaces`,
// then press Enter. You can now see whitespace characters in your code.
public class Main {
    public static void main(String[] args) {
        WebDriver driver = new ChromeDriver();
        System.setProperty("webdriver.chrome.driver","chromedriver");
        //Make an object of Webdriver wait
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(15));

        driver.get("https://yahoo.com/");

        //2. Locate the Sign in button and Click
        driver.findElement(By.linkText("Sign in")).click();

        //3. Locate the username text and enter
        driver.findElement(By.name("username")).sendKeys("youremail@yahoo.com");

        //4. Locate Next button and click
        driver.findElement(By.name("signin")).submit();

        //5. Locate the password text and enter
        //Wait until the password field can be located but this wait is maximum 15 seconds
        wait.until(ExpectedConditions.visibilityOfAllElementsLocatedBy(By.name("password")));
        driver.findElement(By.id("login-passwd")).sendKeys("yourpassword");

        //6. Locate Next button and click
        driver.findElement(By.id("login-signin")).click();

        //7. Locate the Mail button and click
        //Wait until the password field can be located but this wait is maximum 15 seconds
        wait.until(ExpectedConditions.visibilityOfAllElementsLocatedBy(By.id("ybarMailLink")));
        driver.findElement(By.id("ybarMailLink")).click();

        //8. Locate the Compose button and click
        driver.findElement(By.linkText("Compose")).click();

        //9.Locate the email sections and write an email
        //9.1. Locate the 'To' section and send data
        driver.findElement(By.id("message-to-field")).sendKeys("golnoush.abaei@rmit.edu.au");

        //9.2. Locate the 'Subject' section and send data
        driver.findElement(By.id("compose-subject-input")).sendKeys("Hello from Selenium Webdriver");

        //9.3. Locate the 'Body' of Gmail and send data
        driver.findElement(By.xpath("//*[@id=\'editor-container\']/div[1]")).sendKeys("Hello, " + "\n\n" + "This is a message from Selenium Webdriver."+ " I am testing Yahoo." + "\n\n" + "Regards," + "\n\n", "Selenium Webdriver");

        //9.4 Locate the send button and send the email (by clicking)
        driver.findElement(By.xpath("//*[@id=\'mail-app-component\']/div[2]/div/div/div[2]/div/div/div[2]/div[2]/div/button")).click();

        //10. Locate the sent section. and validate the sent email
        //10.1. Locate the sent section and click
        driver.findElement(By.linkText("Sent")).click();

        //10.2. Print success if it passes the previous step
        System.out.println("Message has been sent successfully");
    }
}