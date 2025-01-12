const { test, expect, beforeEach, describe } = require('@playwright/test')

describe('Blog app', () => {
  beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173')
  })

  test('Login form is shown', async ({ page }) => {
    // Check for login form elements
    const username = await page.getByText('username')
    await expect(username).toBeVisible()
    const password = await page.getByText('password')
    await expect(password).toBeVisible()

    const loginButton = await page.getByText('login')
    await expect(loginButton).toBeVisible()

    
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await page.getByTestId('username').fill('geniepie12')
      await page.getByTestId('password').fill('pooppie')
      await page.getByRole('button', { name: 'login' }).click()

      await expect(page.getByText('Gene logged-in')).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await page.getByTestId('username').fill('testuser')
      await page.getByTestId('password').fill('wrongpassword')
      await page.getByRole('button', { name: 'login' }).click()

      const errorMessage = await page.getByText('wrong username or password')
      await expect(errorMessage).toBeVisible()
      await expect(errorMessage).toHaveCSS('color', 'rgb(255, 0, 0)')
    })
  })

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await page.goto('http://localhost:5173')
      await page.getByTestId('username').fill('geniepie12')
      await page.getByTestId('password').fill('pooppie')
      await page.getByRole('button', { name: 'login' }).click()
      
      // Verify login was successful
      await expect(page.getByText('Gene logged-in')).toBeVisible()

      // Create a blog for testing likes
      await page.getByRole('button', { name: 'new blog' }).click()
      await page.getByTestId('title-input').fill('Test Blog for Likes')
      await page.getByTestId('author-input').fill('Test Author')
      await page.getByTestId('url-input').fill('http://testblog.com')
      await page.getByRole('button', { name: 'create' }).click()
    })

    test('a new blog can be created', async ({ page }) => {
      // Click the new blog button
      await page.getByRole('button', { name: 'new blog' }).click()
      
      // Fill in the blog details
      await page.getByTestId('title-input').fill('Test Blog Title')
      await page.getByTestId('author-input').fill('Test Author')
      await page.getByTestId('url-input').fill('http://testblog.com')
      
      // Submit the blog
      await page.getByRole('button', { name: 'create' }).click()
      
      // Verify the blog appears in the list
      const blogEntry = await page.getByText('Test Blog Title by Test Author')
      await expect(blogEntry).toBeVisible()
    })

    test('a blog can be liked', async ({ page }) => {
      // First, we need to make the like button visible by clicking view
      await page.getByText('Test Blog for Likes').locator('..').getByRole('button', { name: 'view' }).click()

      // Get the initial likes text
      const initialLikes = await page.getByText('likes').textContent()
      const initialCount = parseInt(initialLikes.split(' ')[1])

      // Click the like button
      await page.getByRole('button', { name: 'like' }).click()

      // Wait for and verify the likes count has increased
      const updatedLikes = await page.getByText('likes').textContent()
      const updatedCount = parseInt(updatedLikes.split(' ')[1])
      
      // Verify the like count increased by 1
      await expect(updatedCount).toBe(initialCount + 1)
    })
  })
})