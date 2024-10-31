import com.inflectra.spiratest.addons.junitextension.SpiraTestCase;
import org.junit.jupiter.api.*;
import org.openqa.selenium.By;
import org.openqa.selenium.Dimension;
import org.openqa.selenium.Point;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.interactions.Actions;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.Select;
import org.openqa.selenium.support.ui.WebDriverWait;
import java.time.Duration;
import static org.junit.jupiter.api.Assertions.*;

@TestMethodOrder(MethodOrderer.OrderAnnotation.class)

class TestSidePanel {
    private static ChromeDriver driver;
    private WebDriverWait wait;

    @BeforeAll
    public static void setup()
    {
        System.setProperty("Webdriver.chrome.driver","chromedriver");
        driver = new ChromeDriver();
        driver.get("http://localhost:3000");
    }

    @Test
    @Order(1)
    public void sidePanelShouldShowOnMouseMovement()
    {
        wait = new WebDriverWait(driver, Duration.ofSeconds(10));

        // Get browser window size
        Dimension windowSize = driver.manage().window().getSize();

        // Calculate position for top right corner (slight offset from edge)
        Point topRight = new Point(windowSize.getWidth() - 10, 10);

        // Create Actions instance
        Actions actions = new Actions(driver);

        // Move mouse to top right corner
        actions.moveByOffset(topRight.getX(), topRight.getY()).perform();

        // Wait for side panel to become visible
        WebElement sidePanel = wait.until(ExpectedConditions.visibilityOfElementLocated(
                By.xpath("//*[@id=\"root\"]/div/div/div[2]/div/div")
        ));

        // Assert that panel is displayed
        assertTrue(sidePanel.isDisplayed());
    }

    @Test
    @Order(2)
    public void clickingSearchButtonShouldDisplaySearchQueryModal() throws InterruptedException {

        wait = new WebDriverWait(driver, Duration.ofSeconds(10));
        wait.until(ExpectedConditions.elementToBeClickable(By.xpath("//*[@id=\"root\"]/div/div/div[2]/div/div/div[2]/div[2]/button"))).click();
        var searchQueryModal = wait.until(ExpectedConditions.presenceOfElementLocated(
                By.xpath("//p[text()='Database Search']")));
        Thread.sleep(2000);
        assertEquals("Database Search", searchQueryModal.getText());
    }

    @Test
    @Order(3)
    public void clickingXButtonShouldCloseSearchQueryModal() {
        wait = new WebDriverWait(driver, Duration.ofSeconds(10));

        // Store the xpath for reuse
        String xButtonXPath = "//*[@id=\"root\"]/div/div/div[2]/div/div[2]/div/div/div/div/div[1]/div";

        // Find and click the X button
        WebElement xButton = wait.until(ExpectedConditions.elementToBeClickable(By.xpath(xButtonXPath)));
        xButton.click();

        // Verify the modal is gone by checking that the element is no longer present
        boolean isModalGone = wait.until(ExpectedConditions.invisibilityOfElementLocated(By.xpath(xButtonXPath)));
        assertTrue(isModalGone, "Modal should not be visible after clicking X button");
    }

    @Test
    @Order(4)
    public void clickingTabShouldChangeAppliedStyle() {

        wait = new WebDriverWait(driver, Duration.ofSeconds(10));
        WebElement tab = wait.until(ExpectedConditions.elementToBeClickable(By.xpath("//*[@id=\"root\"]/div/div/div[2]/div/div/div[2]/div[1]/button[2]")));
        tab.click();
        wait.until(ExpectedConditions.attributeContains(tab, "class", "light-gradient"));

        String classes = tab.getAttribute("class");
        assertTrue(classes.contains("light-gradient"));
    }

    @Test
    @Order(5)
    public void correctTextShouldDisplayOnInput() {
        wait = new WebDriverWait(driver, Duration.ofSeconds(10));
        WebElement highlightSearchField = wait.until(ExpectedConditions.elementToBeClickable(By.xpath("//*[@id=\"root\"]/div/div/div[2]/div/div/div[4]/div/div[2]/input\n")));
        highlightSearchField.click();
        highlightSearchField.sendKeys("Bushfire");

        String actualText = highlightSearchField.getAttribute("value");
        assertEquals("Bushfire", actualText);
    }

    @Test
    @Order(6)
    public void verifyDropdownCanSelectItem() {
        wait = new WebDriverWait(driver, Duration.ofSeconds(10));

        // Wait for and find the dropdown
        WebElement dropdown = wait.until(ExpectedConditions.elementToBeClickable(By.xpath("//*[@id=\"root\"]/div/div/div[2]/div/div/div[4]/div/div[3]/select[1]")));

        // Create Select object for easier dropdown handling
        Select broadClaimSelect = new Select(dropdown);

        // Select an option by visible text
        broadClaimSelect.selectByVisibleText("climate change impacts are not that bad");

        // Verify the selection
        String selectedOption = broadClaimSelect.getFirstSelectedOption().getText();
        assertEquals("climate change impacts are not that bad", selectedOption);
    }

    @AfterAll
    public static void CloseBrowser()
    {
        driver.close();
    }

}