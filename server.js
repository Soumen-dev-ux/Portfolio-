const express = require("express")
const nodemailer = require("nodemailer")
const cors = require("cors")
const rateLimit = require("express-rate-limit")
const helmet = require("helmet")
const validator = require("validator")
const path = require("path")
require("dotenv").config()

const app = express()
const PORT = process.env.PORT || 3000

// Security middleware
app.use(helmet())

// CORS configuration
app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production"
        ? ["https://yourdomain.com", "https://www.yourdomain.com"]
        : ["http://localhost:3000", "http://127.0.0.1:3000"],
    credentials: true,
  }),
)

// Rate limiting
const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: {
    error: "Too many contact form submissions, please try again later.",
    retryAfter: "15 minutes",
  },
  standardHeaders: true,
  legacyHeaders: false,
})

// Body parser middleware
app.use(express.json({ limit: "10mb" }))
app.use(express.urlencoded({ extended: true, limit: "10mb" }))

// Serve static files
app.use(express.static(path.join(__dirname)))

// Email transporter configuration
const createTransporter = () => {
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "soumenpore7777@gmail.com", // <-- your Gmail address
      pass: process.env.EMAIL_PASS,      // <-- Gmail app password (keep in .env)
    },
  })
}

// Input validation and sanitization
const validateContactForm = (req, res, next) => {
  const { name, email, message } = req.body
  const errors = []

  // Validate name
  if (!name || typeof name !== "string") {
    errors.push("Name is required")
  } else if (name.trim().length < 2 || name.trim().length > 100) {
    errors.push("Name must be between 2 and 100 characters")
  }

  // Validate email
  if (!email || typeof email !== "string") {
    errors.push("Email is required")
  } else if (!validator.isEmail(email)) {
    errors.push("Please provide a valid email address")
  }

  // Validate message
  if (!message || typeof message !== "string") {
    errors.push("Message is required")
  } else if (message.trim().length < 10 || message.trim().length > 1000) {
    errors.push("Message must be between 10 and 1000 characters")
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      errors: errors,
    })
  }

  // Sanitize inputs
  req.body.name = validator.escape(name.trim())
  req.body.email = validator.normalizeEmail(email.trim())
  req.body.message = validator.escape(message.trim())

  next()
}

// Contact form endpoint
app.post("/api/contact", contactLimiter, validateContactForm, async (req, res) => {
  try {
    const { name, email, message } = req.body
    const userIP = req.ip || req.connection.remoteAddress
    const userAgent = req.get("User-Agent")
    const timestamp = new Date().toISOString()

    console.log(`Contact form submission from ${email} at ${timestamp}`)

    const transporter = createTransporter()

    // Email to you (notification)
    const adminMailOptions = {
      from: "soumenpore7777@gmail.com", // <-- your Gmail address
      to: "soumenpore7777@gmail.com",   // <-- receive emails here
      subject: `New Contact Form Submission from ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
          <div style="background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%); color: white; padding: 20px; border-radius: 10px 10px 0 0; text-align: center;">
            <h2 style="margin: 0;">New Contact Form Submission</h2>
          </div>
          
          <div style="padding: 20px; background-color: #f9fafb;">
            <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 15px;">
              <h3 style="color: #2563eb; margin-top: 0;">Contact Details</h3>
              <p><strong>Name:</strong> ${name}</p>
              <p><strong>Email:</strong> <a href="mailto:${email}" style="color: #2563eb;">${email}</a></p>
              <p><strong>Submitted:</strong> ${new Date(timestamp).toLocaleString()}</p>
            </div>
            
            <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 15px;">
              <h3 style="color: #2563eb; margin-top: 0;">Message</h3>
              <div style="background: #f3f4f6; padding: 15px; border-radius: 5px; border-left: 4px solid #2563eb;">
                ${message.replace(/\n/g, "<br>")}
              </div>
            </div>
            
            <div style="background: white; padding: 20px; border-radius: 8px;">
              <h3 style="color: #6b7280; margin-top: 0; font-size: 14px;">Technical Details</h3>
              <p style="font-size: 12px; color: #9ca3af;">IP: ${userIP}</p>
              <p style="font-size: 12px; color: #9ca3af;">User Agent: ${userAgent}</p>
            </div>
          </div>
          
          <div style="text-align: center; padding: 20px; background-color: #f3f4f6; border-radius: 0 0 10px 10px;">
            <p style="margin: 0; color: #6b7280; font-size: 14px;">
              This email was sent from your portfolio contact form
            </p>
          </div>
        </div>
      `,
    }

    // Auto-reply email to the user
    const userMailOptions = {
      from: "soumenpore7777@gmail.com",
      to: EMAIL_USER,
      subject: "Thank you for contacting me!",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
          <div style="background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%); color: white; padding: 20px; border-radius: 10px 10px 0 0; text-align: center;">
            <h2 style="margin: 0;">Thank You for Reaching Out!</h2>
          </div>
          
          <div style="padding: 30px; background-color: #f9fafb;">
            <div style="background: white; padding: 25px; border-radius: 8px; text-align: center;">
              <h3 style="color: #2563eb; margin-top: 0;">Hi ${name}!</h3>
              
              <p style="color: #4b5563; line-height: 1.6; margin-bottom: 20px;">
                Thank you for getting in touch! I've received your message and I'm excited to connect with you.
              </p>
              
              <div style="background: #eff6ff; padding: 20px; border-radius: 8px; border-left: 4px solid #2563eb; margin: 20px 0;">
                <p style="margin: 0; color: #1e40af; font-weight: 500;">
                  <strong>Your message:</strong><br>
                  <em style="color: #4b5563;">"${message.substring(0, 150)}${message.length > 150 ? "..." : ""}"</em>
                </p>
              </div>
              
              <p style="color: #4b5563; line-height: 1.6;">
                I typically respond within <strong>24-48 hours</strong>. In the meantime, feel free to check out my latest projects or connect with me on social media.
              </p>
              
              <div style="margin: 25px 0;">
                <a href="https://github.com/Soumen-dev-ux" style="display: inline-block; margin: 0 10px; padding: 10px 20px; background: #333; color: white; text-decoration: none; border-radius: 5px;">GitHub</a>
                <a href="https://www.linkedin.com/in/soumen-pore-3998b1312/" style="display: inline-block; margin: 0 10px; padding: 10px 20px; background: #0077b5; color: white; text-decoration: none; border-radius: 5px;">LinkedIn</a>
              </div>
              
              <p style="color: #6b7280; font-size: 14px; margin-top: 25px;">
                Best regards,<br>
                <strong style="color: #2563eb;">Soumen Pore</strong><br>
                Full Stack Developer & Creative Professional
              </p>
            </div>
          </div>
          
          <div style="text-align: center; padding: 15px; background-color: #f3f4f6; border-radius: 0 0 10px 10px;">
            <p style="margin: 0; color: #9ca3af; font-size: 12px;">
              This is an automated response. Please do not reply to this email.
            </p>
          </div>
        </div>
      `,
    }

    // Send both emails
    await Promise.all([transporter.sendMail(adminMailOptions), transporter.sendMail(userMailOptions)])

    console.log(`Emails sent successfully for submission from ${email}`)

    res.status(200).json({
      success: true,
      message: "Thank you for your message! I'll get back to you soon.",
      timestamp: timestamp,
    })
  } catch (error) {
    console.error("Contact form error:", error)

    // Don't expose internal errors to client
    res.status(500).json({
      success: false,
      message: "Sorry, there was an error sending your message. Please try again later.",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    })
  }
})

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  })
})

// Test email configuration endpoint (development only)
if (process.env.NODE_ENV === "development") {
  app.get("/api/test-email", async (req, res) => {
    try {
      const transporter = createTransporter()
      await transporter.verify()
      res.json({ success: true, message: "Email configuration is working!" })
    } catch (error) {
      res.status(500).json({ success: false, error: error.message })
    }
  })
}

// Serve the main HTML file for all other routes (SPA support)
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"))
})

// Error handling middleware
app.use((error, req, res, next) => {
  console.error("Unhandled error:", error)
  res.status(500).json({
    success: false,
    message: "Internal server error",
  })
})

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
  console.log(`Environment: ${process.env.NODE_ENV || "development"}`)

  if (process.env.NODE_ENV === "development") {
    console.log(`Local: http://localhost:${PORT}`)
    console.log(`Test email config: http://localhost:${PORT}/api/test-email`)
  }
})

module.exports = app
