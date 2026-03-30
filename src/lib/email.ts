import { Resend } from "resend";

export const resend = new Resend(process.env.RESEND_API_KEY);

// Shared professional dark theme styles
const professionalDarkStyles = `
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
    
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      line-height: 1.6;
      background: #0a0f1a;
      margin: 0;
      padding: 40px 20px;
    }
    
    .email-wrapper {
      max-width: 600px;
      margin: 0 auto;
    }
    
    .card {
      background: #111827;
      border-radius: 16px;
      overflow: hidden;
      border: 1px solid #1f2a3e;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
    }
    
    .hero-image {
      width: 100%;
      height: auto;
      display: block;
    }
    
    .header {
      padding: 32px 32px 24px 32px;
      text-align: center;
      border-bottom: 1px solid #1f2a3e;
    }
    
    .logo {
      font-size: 28px;
      font-weight: 700;
      color: #ffffff;
      letter-spacing: -0.3px;
      margin-bottom: 8px;
    }
    
    .logo span {
      font-weight: 500;
      color: #3b82f6;
    }
    
    .tagline {
      color: #9ca3af;
      font-size: 14px;
      font-weight: 400;
    }
    
    .content {
      padding: 40px 40px 32px 40px;
    }
    
    h1 {
      font-size: 26px;
      font-weight: 600;
      color: #ffffff;
      margin-bottom: 16px;
      line-height: 1.3;
    }
    
    h2 {
      font-size: 24px;
      font-weight: 600;
      color: #ffffff;
      margin-bottom: 16px;
      line-height: 1.3;
    }
    
    p {
      color: #d1d5db;
      font-size: 16px;
      line-height: 1.6;
      margin-bottom: 20px;
    }
    
    .button {
      display: inline-block;
      background: #3b82f6;
      color: #ffffff !important;
      padding: 12px 28px;
      text-decoration: none;
      border-radius: 8px;
      font-weight: 500;
      font-size: 15px;
      margin: 16px 0;
      transition: background-color 0.2s ease;
      border: none;
    }
    
    .button:hover {
      background: #2563eb;
    }
    
    .alt-link {
      margin-top: 16px;
      font-size: 14px;
    }
    
    .alt-link a {
      color: #3b82f6;
      text-decoration: none;
      font-weight: 500;
    }
    
    .alt-link a:hover {
      text-decoration: underline;
    }
    
    .divider {
      height: 1px;
      background: #1f2a3e;
      margin: 32px 0;
    }
    
    .feature-list {
      background: #1a2533;
      border-radius: 12px;
      padding: 24px;
      margin: 32px 0;
    }
    
    .feature-item {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      margin-bottom: 16px;
      color: #e5e7eb;
      font-size: 15px;
      line-height: 1.5;
    }
    
    .feature-item:last-child {
      margin-bottom: 0;
    }
    
    .feature-icon {
      font-size: 18px;
      font-weight: 600;
      min-width: 24px;
      color: #3b82f6;
    }
    
    .feedback-card {
      background: #1a2533;
      border-left: 3px solid #3b82f6;
      padding: 20px;
      margin: 24px 0;
      border-radius: 8px;
    }
    
    .feedback-text {
      color: #e5e7eb;
      font-size: 15px;
      line-height: 1.6;
      margin: 0;
    }
    
    .feedback-label {
      color: #3b82f6;
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 12px;
      display: block;
    }
    
    .lesson-card {
      background: #1a2533;
      border-radius: 12px;
      padding: 28px;
      margin: 24px 0;
      text-align: center;
      border: 1px solid #2d3a4a;
    }
    
    .lesson-title {
      color: #ffffff;
      font-size: 20px;
      font-weight: 600;
      margin: 16px 0 8px 0;
    }
    
    .lesson-badge {
      display: inline-block;
      background: #3b82f6;
      color: #ffffff;
      padding: 4px 12px;
      border-radius: 6px;
      font-size: 12px;
      font-weight: 500;
      margin-top: 12px;
    }
    
    .subscription-card {
      background: #1a2533;
      border-radius: 12px;
      padding: 28px;
      margin: 24px 0;
      text-align: center;
      border: 1px solid #2d3a4a;
    }
    
    .plan-badge {
      display: inline-block;
      background: #3b82f6;
      color: #ffffff;
      padding: 6px 16px;
      border-radius: 6px;
      font-size: 13px;
      font-weight: 600;
      margin-bottom: 20px;
    }
    
    .feature-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 12px;
      margin: 24px 0;
    }
    
    .grid-item {
      background: #111827;
      padding: 12px;
      border-radius: 8px;
      color: #e5e7eb;
      font-size: 14px;
      text-align: center;
      border: 1px solid #2d3a4a;
    }
    
    .next-steps {
      background: #1a2533;
      border-radius: 12px;
      padding: 24px;
      margin: 32px 0;
    }
    
    .step {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 16px;
      color: #e5e7eb;
      font-size: 15px;
    }
    
    .step-number {
      background: #3b82f6;
      color: #ffffff;
      width: 28px;
      height: 28px;
      border-radius: 50%;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-size: 13px;
      font-weight: 600;
      flex-shrink: 0;
    }
    
    .info-box {
      background: #1a2533;
      border-radius: 12px;
      padding: 20px;
      margin: 24px 0;
    }
    
    .info-text {
      color: #d1d5db;
      font-size: 14px;
      line-height: 1.6;
    }
    
    .footer {
      background: #0f1117;
      padding: 32px 40px;
      text-align: center;
      border-top: 1px solid #1f2a3e;
    }
    
    .footer p {
      color: #6b7280;
      font-size: 13px;
      margin-bottom: 12px;
    }
    
    .footer a {
      color: #3b82f6;
      text-decoration: none;
    }
    
    .footer a:hover {
      text-decoration: underline;
    }
    
    @media (max-width: 600px) {
      body {
        padding: 20px;
      }
      
      .content {
        padding: 32px 24px;
      }
      
      .footer {
        padding: 24px;
      }
      
      h1, h2 {
        font-size: 22px;
      }
      
      .feature-grid {
        grid-template-columns: 1fr;
      }
    }
  </style>
`;

// Hero images (professional skiing photography)
const heroImages = {
  verification:
    "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=1200&h=400&fit=crop",
  welcome:
    "https://images.unsplash.com/photo-1484591974057-265bb767ef71?w=1200&h=400&fit=crop",
  instructor:
    "https://images.unsplash.com/photo-1551524559-8af4e6624178?w=1200&h=400&fit=crop",
  lesson:
    "https://images.unsplash.com/photo-1511994298241-608e28f14fde?w=1200&h=400&fit=crop",
  subscription:
    "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=400&fit=crop",
};

// Send verification email
export async function sendVerificationEmail(email: string, token: string) {
  const verificationUrl = `${process.env.NEXTAUTH_URL}/api/auth/verify?token=${token}`;

  try {
    await resend.emails.send({
      from: "SkiLesson.ai <verify@resend.dev>",
      to: email,
      subject: "Verify your email address",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          ${professionalDarkStyles}
        </head>
        <body>
          <div class="email-wrapper">
            <div class="card">
              <img src="${
                heroImages.verification
              }" alt="Ski slope at sunset" class="hero-image" style="width:100%; height:200px; object-fit:cover;">
              
              <div class="header">
                <div class="logo">SkiLesson<span>.ai</span></div>
                <div class="tagline">AI-powered ski coaching</div>
              </div>
              
              <div class="content">
                <h1>Verify your email address</h1>
                
                <p>
                  Thank you for choosing SkiLesson.ai. Please verify your email address to begin your journey with personalized AI ski coaching.
                </p>
                
                <div style="text-align: center;">
                  <a href="${verificationUrl}" class="button">
                    Verify Email Address
                  </a>
                </div>
                
                <div class="alt-link">
                  Or copy and paste this link into your browser:<br>
                  <a href="${verificationUrl}">${verificationUrl}</a>
                </div>
                
                <div class="divider"></div>
                
                <div class="feature-list">
                  <div class="feature-item">
                    <span class="feature-icon">→</span>
                    <span>Upload skiing videos for AI analysis</span>
                  </div>
                  <div class="feature-item">
                    <span class="feature-icon">→</span>
                    <span>Receive real-time technique feedback</span>
                  </div>
                  <div class="feature-item">
                    <span class="feature-icon">→</span>
                    <span>Track progress over time</span>
                  </div>
                </div>
                
                <p style="color: #9ca3af; font-size: 13px;">
                  This verification link will expire in 24 hours for security reasons.
                </p>
              </div>
              
              <div class="footer">
                <p>
                  Questions? <a href="${
                    process.env.NEXTAUTH_URL
                  }/support">Contact Support</a>
                </p>
                <p style="font-size: 12px;">
                  © ${new Date().getFullYear()} SkiLesson.ai. All rights reserved.
                </p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    console.log("Verification email sent to:", email);
  } catch (err) {
    console.error("Verification email failed:", err);
    throw err;
  }
}

// Send welcome email
export async function sendWelcomeEmail(email: string) {
  const dashboardUrl = `${process.env.NEXTAUTH_URL}/dashboard`;

  try {
    await resend.emails.send({
      from: "SkiLesson.ai <welcome@resend.dev>",
      to: email,
      subject: "Welcome to SkiLesson.ai",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          ${professionalDarkStyles}
        </head>
        <body>
          <div class="email-wrapper">
            <div class="card">
              <img src="${
                heroImages.welcome
              }" alt="Skiier carving down mountain" class="hero-image" style="width:100%; height:200px; object-fit:cover;">
              
              <div class="header">
                <div class="logo">SkiLesson<span>.ai</span></div>
                <div class="tagline">Your personal AI ski coach</div>
              </div>
              
              <div class="content">
                <h1>Welcome to SkiLesson.ai</h1>
                
                <p>
                  We're thrilled to have you join the SkiLesson.ai community. Get ready to transform your skiing technique with the power of artificial intelligence.
                </p>
                
                <div class="feature-list">
                  <div class="feature-item">
                    <span class="feature-icon">1.</span>
                    <span><strong>Record</strong> - Capture your skiing runs</span>
                  </div>
                  <div class="feature-item">
                    <span class="feature-icon">2.</span>
                    <span><strong>Upload</strong> - Share videos to your dashboard</span>
                  </div>
                  <div class="feature-item">
                    <span class="feature-icon">3.</span>
                    <span><strong>Analyze</strong> - Receive AI-powered technique feedback</span>
                  </div>
                  <div class="feature-item">
                    <span class="feature-icon">4.</span>
                    <span><strong>Improve</strong> - Track progress and refine skills</span>
                  </div>
                </div>
                
                <div style="text-align: center;">
                  <a href="${dashboardUrl}" class="button">
                    Access Your Dashboard
                  </a>
                </div>
                
                <div class="alt-link">
                  <a href="${process.env.NEXTAUTH_URL}/getting-started">
                    Read our getting started guide
                  </a>
                </div>
                
                <div class="divider"></div>
                
                <div class="info-box">
                  <div class="info-text">
                    <strong>Recommendation:</strong> Start with short videos of 30-60 seconds for the most accurate analysis results.
                  </div>
                </div>
              </div>
              
              <div class="footer">
                <p>
                  Need assistance? <a href="${
                    process.env.NEXTAUTH_URL
                  }/support">Contact Support</a>
                </p>
                <p style="font-size: 12px;">
                  © ${new Date().getFullYear()} SkiLesson.ai. All rights reserved.
                </p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    console.log("Welcome email sent to:", email);
  } catch (err) {
    console.error("Welcome email failed:", err);
    throw err;
  }
}

// Send instructor reply email
export async function sendInstructorReplyEmail(
  email: string,
  feedback: string
) {
  const dashboardUrl = `${process.env.NEXTAUTH_URL}/dashboard`;

  try {
    await resend.emails.send({
      from: "SkiLesson.ai <instructor@resend.dev>",
      to: email,
      subject: "Your instructor replied to your submission",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          ${professionalDarkStyles}
        </head>
        <body>
          <div class="email-wrapper">
            <div class="card">
              <img src="${
                heroImages.instructor
              }" alt="Ski instructor coaching" class="hero-image" style="width:100%; height:200px; object-fit:cover;">
              
              <div class="header">
                <div class="logo">SkiLesson<span>.ai</span></div>
                <div class="tagline">Expert coaching, AI-powered</div>
              </div>
              
              <div class="content">
                <h2>New feedback from your instructor</h2>
                
                <p>
                  Your instructor has reviewed your submission and provided personalized feedback to help you improve your technique.
                </p>
                
                <div class="feedback-card">
                  <span class="feedback-label">Instructor's Feedback</span>
                  <div class="feedback-text">${feedback}</div>
                </div>
                
                <div style="text-align: center;">
                  <a href="${dashboardUrl}" class="button">
                    View Full Feedback
                  </a>
                </div>
                
                <div class="info-box">
                  <div class="info-text">
                    <strong>Recommendation:</strong> Apply this feedback in your next session and submit a new video to track your progress.
                  </div>
                </div>
                
                <div class="alt-link">
                  <a href="${dashboardUrl}/submissions">
                    View all your submissions
                  </a>
                </div>
              </div>
              
              <div class="footer">
                <p>
                  Have questions? <a href="${
                    process.env.NEXTAUTH_URL
                  }/support">Contact Support</a>
                </p>
                <p style="font-size: 12px;">
                  © ${new Date().getFullYear()} SkiLesson.ai. All rights reserved.
                </p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    console.log("Instructor reply email sent to:", email);
  } catch (err) {
    console.error("Instructor reply email failed:", err);
    throw err;
  }
}

// Send new lesson email
export async function sendNewLessonEmail(email: string, title: string) {
  const dashboardUrl = `${process.env.NEXTAUTH_URL}/dashboard`;

  try {
    await resend.emails.send({
      from: "SkiLesson.ai <lessons@resend.dev>",
      to: email,
      subject: `New lesson available: ${title}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          ${professionalDarkStyles}
        </head>
        <body>
          <div class="email-wrapper">
            <div class="card">
              <img src="${
                heroImages.lesson
              }" alt="Ski lesson on mountain" class="hero-image" style="width:100%; height:200px; object-fit:cover;">
              
              <div class="header">
                <div class="logo">SkiLesson<span>.ai</span></div>
                <div class="tagline">Expand your skills</div>
              </div>
              
              <div class="content">
                <h2>New lesson available</h2>
                
                <p>
                  A new lesson has been added to your library to help you advance your skiing technique.
                </p>
                
                <div class="lesson-card">
                  <div class="lesson-title">${title}</div>
                  <div class="lesson-badge">New Release</div>
                </div>
                
                <div style="text-align: center;">
                  <a href="${dashboardUrl}" class="button">
                    Watch Lesson
                  </a>
                </div>
                
                <div class="feature-list">
                  <div class="feature-item">
                    <span class="feature-icon">→</span>
                    <span>Professional techniques from certified instructors</span>
                  </div>
                  <div class="feature-item">
                    <span class="feature-icon">→</span>
                    <span>Step-by-step breakdowns</span>
                  </div>
                  <div class="feature-item">
                    <span class="feature-icon">→</span>
                    <span>Practice drills included</span>
                  </div>
                </div>
                
                <div class="divider"></div>
                
                <p style="color: #9ca3af; font-size: 14px; text-align: center;">
                  Complete this lesson to earn experience points and unlock achievements.
                </p>
              </div>
              
              <div class="footer">
                <p>
                  <a href="${
                    process.env.NEXTAUTH_URL
                  }/profile/notifications">Manage notifications</a> • 
                  <a href="${process.env.NEXTAUTH_URL}/support">Need help?</a>
                </p>
                <p style="font-size: 12px;">
                  © ${new Date().getFullYear()} SkiLesson.ai. All rights reserved.
                </p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    console.log("New lesson email sent to:", email);
  } catch (err) {
    console.error("New lesson email failed:", err);
    throw err;
  }
}

// Send subscription email
export async function sendSubscriptionEmail(email: string) {
  const dashboardUrl = `${process.env.NEXTAUTH_URL}/dashboard`;

  try {
    await resend.emails.send({
      from: "SkiLesson.ai <subscriptions@resend.dev>",
      to: email,
      subject: "Your Pro subscription is active",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          ${professionalDarkStyles}
        </head>
        <body>
          <div class="email-wrapper">
            <div class="card">
              <img src="${
                heroImages.subscription
              }" alt="Professional skier on slope" class="hero-image" style="width:100%; height:200px; object-fit:cover;">
              
              <div class="header">
                <div class="logo">SkiLesson<span>.ai</span></div>
                <div class="tagline">Unlock your full potential</div>
              </div>
              
              <div class="content">
                <h2>Your Pro subscription is active</h2>
                
                <p>
                  Welcome to SkiLesson.ai Pro. You now have access to all premium features designed to accelerate your skiing progression.
                </p>
                
                <div class="subscription-card">
                  <div class="plan-badge">PRO PLAN • ACTIVE</div>
                  <div class="feature-grid">
                    <div class="grid-item">Unlimited video analysis</div>
                    <div class="grid-item">AI coaching sessions</div>
                    <div class="grid-item">Advanced progress tracking</div>
                    <div class="grid-item">Exclusive lesson library</div>
                    <div class="grid-item">Instructor feedback</div>
                    <div class="grid-item">Achievement badges</div>
                  </div>
                </div>
                
                <div style="text-align: center;">
                  <a href="${dashboardUrl}" class="button">
                    Start Your First Lesson
                  </a>
                </div>
                
                <div class="next-steps">
                  <p style="color: #ffffff; font-weight: 600; margin-bottom: 16px;">Next steps:</p>
                  <div class="step">
                    <span class="step-number">1</span>
                    <span>Upload your first skiing video</span>
                  </div>
                  <div class="step">
                    <span class="step-number">2</span>
                    <span>Receive AI-powered technique analysis</span>
                  </div>
                  <div class="step">
                    <span class="step-number">3</span>
                    <span>Review personalized improvement plan</span>
                  </div>
                  <div class="step">
                    <span class="step-number">4</span>
                    <span>Track progress and refine skills</span>
                  </div>
                </div>
                
                <div class="divider"></div>
                
                <div class="info-box">
                  <div class="info-text">
                    <strong>Recommendation:</strong> Complete your profile to receive personalized lesson recommendations based on your skill level.
                  </div>
                </div>
              </div>
              
              <div class="footer">
                <p>
                  <a href="${
                    process.env.NEXTAUTH_URL
                  }/support">Contact Support</a> • 
                  <a href="${
                    process.env.NEXTAUTH_URL
                  }/billing">Manage Subscription</a>
                </p>
                <p style="font-size: 12px;">
                  © ${new Date().getFullYear()} SkiLesson.ai. All rights reserved.
                </p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    console.log("Subscription email sent to:", email);
  } catch (err) {
    console.error("Subscription email failed:", err);
    throw err;
  }
}
