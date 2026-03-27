import { Resend } from "resend";

export const resend = new Resend(process.env.RESEND_API_KEY);

// Shared email styles
const emailStyles = `
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
      background-color: #f4f7fb;
      margin: 0;
      padding: 0;
    }
    
    .container {
      max-width: 560px;
      margin: 40px auto;
      background: white;
      border-radius: 24px;
      overflow: hidden;
      box-shadow: 0 20px 35px -10px rgba(0, 0, 0, 0.1);
    }
    
    .header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 40px 32px;
      text-align: center;
    }
    
    .logo {
      font-size: 32px;
      font-weight: 800;
      color: white;
      letter-spacing: -0.5px;
      margin-bottom: 12px;
    }
    
    .logo span {
      font-weight: 400;
      opacity: 0.9;
    }
    
    .tagline {
      color: rgba(255, 255, 255, 0.9);
      font-size: 14px;
      font-weight: 500;
    }
    
    .content {
      padding: 48px 40px;
    }
    
    h1 {
      font-size: 28px;
      font-weight: 700;
      color: #1a2c3e;
      margin-bottom: 16px;
      line-height: 1.3;
    }
    
    .subtitle {
      color: #5a6e7c;
      font-size: 16px;
      margin-bottom: 32px;
      border-left: 3px solid #667eea;
      padding-left: 16px;
    }
    
    .button {
      display: inline-block;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white !important;
      padding: 14px 32px;
      text-decoration: none;
      border-radius: 12px;
      font-weight: 600;
      font-size: 16px;
      margin: 24px 0;
      transition: transform 0.2s ease, box-shadow 0.2s ease;
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
    }
    
    .button:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 16px rgba(102, 126, 234, 0.4);
    }
    
    .alt-link {
      margin-top: 24px;
      font-size: 14px;
      color: #8a9aa8;
    }
    
    .alt-link a {
      color: #667eea;
      text-decoration: none;
      font-weight: 500;
    }
    
    .alt-link a:hover {
      text-decoration: underline;
    }
    
    .divider {
      height: 1px;
      background: linear-gradient(to right, transparent, #e2e8f0, transparent);
      margin: 32px 0;
    }
    
    .feature-list {
      background: #f8fafc;
      border-radius: 16px;
      padding: 24px;
      margin: 32px 0;
    }
    
    .feature-item {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 16px;
      color: #334e68;
    }
    
    .feature-item:last-child {
      margin-bottom: 0;
    }
    
    .feature-icon {
      font-size: 20px;
    }
    
    .footer {
      background: #f8fafc;
      padding: 32px 40px;
      text-align: center;
      border-top: 1px solid #e2e8f0;
    }
    
    .footer p {
      color: #8a9aa8;
      font-size: 13px;
      margin-bottom: 12px;
    }
    
    .footer a {
      color: #667eea;
      text-decoration: none;
    }
    
    @media (max-width: 600px) {
      .container {
        margin: 20px;
        border-radius: 20px;
      }
      
      .content {
        padding: 32px 24px;
      }
      
      .footer {
        padding: 24px;
      }
      
      h1 {
        font-size: 24px;
      }
    }
  </style>
`;

const darkEmailStyles = `
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
      background: linear-gradient(135deg, #0a1928 0%, #0a1a2f 100%);
      margin: 0;
      padding: 40px 20px;
    }
    
    .email-wrapper {
      max-width: 560px;
      margin: 0 auto;
    }
    
    .card {
      background: #0a1a2f;
      border-radius: 24px;
      overflow: hidden;
      border: 1px solid rgba(59, 130, 246, 0.2);
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
    }
    
    .header {
      background: linear-gradient(135deg, #0f2b3f 0%, #0a1a2f 100%);
      padding: 40px 32px;
      text-align: center;
      border-bottom: 1px solid rgba(59, 130, 246, 0.3);
    }
    
    .logo {
      font-size: 32px;
      font-weight: 800;
      background: linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%);
      -webkit-background-clip: text;
      background-clip: text;
      color: transparent;
      letter-spacing: -0.5px;
      margin-bottom: 12px;
    }
    
    .logo span {
      font-weight: 400;
      color: #60a5fa;
      opacity: 0.8;
    }
    
    .tagline {
      color: #94a3b8;
      font-size: 14px;
      font-weight: 500;
    }
    
    .content {
      padding: 48px 40px;
    }
    
    h2 {
      font-size: 28px;
      font-weight: 700;
      background: linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%);
      -webkit-background-clip: text;
      background-clip: text;
      color: transparent;
      margin-bottom: 16px;
      line-height: 1.3;
    }
    
    .feedback-card {
      background: rgba(59, 130, 246, 0.1);
      border-left: 4px solid #3b82f6;
      padding: 24px;
      margin: 24px 0;
      border-radius: 12px;
    }
    
    .feedback-text {
      color: #e2e8f0;
      font-size: 16px;
      line-height: 1.7;
      margin: 0;
    }
    
    .feedback-label {
      color: #60a5fa;
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-bottom: 12px;
      display: block;
    }
    
    .button {
      display: inline-block;
      background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
      color: white !important;
      padding: 14px 32px;
      text-decoration: none;
      border-radius: 12px;
      font-weight: 600;
      font-size: 16px;
      margin: 16px 0;
      transition: all 0.2s ease;
      box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
    }
    
    .button:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 16px rgba(59, 130, 246, 0.4);
    }
    
    .alt-link {
      margin-top: 20px;
      font-size: 14px;
    }
    
    .alt-link a {
      color: #60a5fa;
      text-decoration: none;
      font-weight: 500;
    }
    
    .alt-link a:hover {
      text-decoration: underline;
    }
    
    .divider {
      height: 1px;
      background: linear-gradient(to right, transparent, rgba(59, 130, 246, 0.3), transparent);
      margin: 32px 0;
    }
    
    .info-box {
      background: rgba(59, 130, 246, 0.05);
      border-radius: 16px;
      padding: 20px;
      margin: 24px 0;
    }
    
    .info-text {
      color: #94a3b8;
      font-size: 14px;
      line-height: 1.6;
    }
    
    .footer {
      background: rgba(10, 26, 47, 0.8);
      padding: 32px 40px;
      text-align: center;
      border-top: 1px solid rgba(59, 130, 246, 0.2);
    }
    
    .footer p {
      color: #64748b;
      font-size: 13px;
      margin-bottom: 12px;
    }
    
    .footer a {
      color: #60a5fa;
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
      
      h2 {
        font-size: 24px;
      }
    }
  </style>
`;

export async function sendInstructorReplyEmail(
  email: string,
  feedback: string
) {
  const dashboardUrl = `${process.env.NEXTAUTH_URL}/dashboard`;

  try {
    await resend.emails.send({
      from: "SkiLesson.ai <instructor@resend.dev>",
      to: email,
      subject: "🎿 Your instructor replied to your submission",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          ${darkEmailStyles}
        </head>
        <body>
          <div class="email-wrapper">
            <div class="card">
              <div class="header">
                <div class="logo">SkiLesson<span>.ai</span></div>
                <div class="tagline">Expert coaching, AI-powered</div>
              </div>
              
              <div class="content">
                <h2>📬 New feedback from your instructor</h2>
                
                <p style="color: #cbd5e1; margin-bottom: 16px;">
                  Your instructor has reviewed your submission and provided personalized feedback to help you improve.
                </p>
                
                <div class="feedback-card">
                  <span class="feedback-label">🎯 Instructor's Feedback</span>
                  <div class="feedback-text">${feedback}</div>
                </div>
                
                <div style="text-align: center;">
                  <a href="${dashboardUrl}" class="button">
                    View full feedback →
                  </a>
                </div>
                
                <div class="info-box">
                  <div class="info-text">
                    💡 <strong>Pro tip:</strong> Apply this feedback in your next session and submit a new video to track your progress!
                  </div>
                </div>
                
                <div class="alt-link">
                  <a href="${dashboardUrl}/submissions">
                    📂 View all your submissions
                  </a>
                </div>
              </div>
              
              <div class="footer">
                <p>
                  Have questions? <a href="${
                    process.env.NEXTAUTH_URL
                  }/support">Contact support</a>
                </p>
                <p style="font-size: 12px;">
                  © ${new Date().getFullYear()} SkiLesson.ai. Keep improving! 🏔️
                </p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    console.log("✅ Instructor reply email sent to:", email);
  } catch (err) {
    console.error("❌ Instructor reply email failed:", err);
    throw err;
  }
}

// ✅ send verification email
export async function sendVerificationEmail(email: string, token: string) {
  console.log("📨 Sending verification email to:", email);

  const verificationUrl = `${process.env.NEXTAUTH_URL}/api/auth/verify?token=${token}`;

  try {
    const res = await resend.emails.send({
      from: "SkiLesson.ai <onboarding@resend.dev>",
      to: email,
      subject: "Verify your email address ✨",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          ${emailStyles}
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">SkiLesson<span>.ai</span></div>
              <div class="tagline">Master the slopes with AI coaching</div>
            </div>
            
            <div class="content">
              <h1>Welcome to the mountain! 🏔️</h1>
              <div class="subtitle">
                One last step to start your skiing journey
              </div>
              
              <p style="margin-bottom: 16px; color: #334e68;">
                Thanks for joining SkiLesson.ai! We're excited to help you improve your skiing technique with personalized AI coaching.
              </p>
              
              <div style="text-align: center;">
                <a href="${verificationUrl}" class="button">
                  Verify my email →
                </a>
              </div>
              
              <div class="alt-link">
                Or copy and paste this link into your browser:<br>
                <a href="${verificationUrl}">${verificationUrl}</a>
              </div>
              
              <div class="divider"></div>
              
              <div class="feature-list">
                <div class="feature-item">
                  <span class="feature-icon">🎥</span>
                  <span>Upload your skiing videos for AI analysis</span>
                </div>
                <div class="feature-item">
                  <span class="feature-icon">🤖</span>
                  <span>Get real-time technique feedback</span>
                </div>
                <div class="feature-item">
                  <span class="feature-icon">📊</span>
                  <span>Track your progress over time</span>
                </div>
              </div>
              
              <p style="color: #5a6e7c; font-size: 14px;">
                This link will expire in 24 hours for security reasons.
              </p>
            </div>
            
            <div class="footer">
              <p>
                Questions? Reply to this email or visit our 
                <a href="${process.env.NEXTAUTH_URL}/help">Help Center</a>
              </p>
              <p style="font-size: 12px;">
                © ${new Date().getFullYear()} SkiLesson.ai. All rights reserved.
              </p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    console.log("✅ Verification email sent:", res);
  } catch (err) {
    console.error("❌ Verification email failed:", err);
    throw err;
  }
}

// ✅ welcome email
export async function sendWelcomeEmail(email: string) {
  const dashboardUrl = `${process.env.NEXTAUTH_URL}/dashboard`;

  try {
    await resend.emails.send({
      from: "SkiLesson.ai <onboarding@resend.dev>",
      to: email,
      subject: "Welcome to SkiLesson.ai! 🎿 Ready to level up?",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          ${emailStyles}
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">SkiLesson<span>.ai</span></div>
              <div class="tagline">Your personal AI ski coach</div>
            </div>
            
            <div class="content">
              <h1>Welcome aboard! 🎉</h1>
              <div class="subtitle">
                Your journey to becoming a better skier starts now
              </div>
              
              <p style="margin-bottom: 24px; color: #334e68;">
                Hi there! We're thrilled to have you join the SkiLesson.ai community. 
                Get ready to transform your skiing technique with the power of AI.
              </p>
              
              <div class="feature-list">
                <div class="feature-item">
                  <span class="feature-icon">📱</span>
                  <span><strong>Step 1:</strong> Record your skiing runs</span>
                </div>
                <div class="feature-item">
                  <span class="feature-icon">☁️</span>
                  <span><strong>Step 2:</strong> Upload videos to your dashboard</span>
                </div>
                <div class="feature-item">
                  <span class="feature-icon">🔍</span>
                  <span><strong>Step 3:</strong> Get AI-powered technique analysis</span>
                </div>
                <div class="feature-item">
                  <span class="feature-icon">🏆</span>
                  <span><strong>Step 4:</strong> Track improvements & earn achievements</span>
                </div>
              </div>
              
              <div style="text-align: center;">
                <a href="${dashboardUrl}" class="button">
                  Go to your dashboard →
                </a>
              </div>
              
              <div class="alt-link">
                <a href="${process.env.NEXTAUTH_URL}/getting-started">
                  📖 Read our getting started guide
                </a>
              </div>
              
              <div class="divider"></div>
              
              <p style="color: #5a6e7c; font-size: 14px; text-align: center;">
                💡 <strong>Pro tip:</strong> Start with short videos (30-60 seconds) 
                for the most accurate analysis!
              </p>
            </div>
            
            <div class="footer">
              <p>
                Follow us on 
                <a href="#">Twitter</a> • 
                <a href="#">Instagram</a> • 
                <a href="#">YouTube</a>
              </p>
              <p>
                Need help? <a href="${
                  process.env.NEXTAUTH_URL
                }/support">Contact support</a>
              </p>
              <p style="font-size: 12px;">
                © ${new Date().getFullYear()} SkiLesson.ai. Made with ⛷️ for skiers everywhere.
              </p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    console.log("✅ Welcome email sent to:", email);
  } catch (err) {
    console.error("❌ Welcome email failed:", err);
    throw err;
  }
}
export async function sendNewLessonEmail(email: string, title: string) {
  const dashboardUrl = `${process.env.NEXTAUTH_URL}/dashboard`;

  try {
    await resend.emails.send({
      from: "SkiLesson.ai <lessons@resend.dev>",
      to: email,
      subject: "🎥 New lesson available: " + title,
      html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            ${darkEmailStyles}
          </head>
          <body>
            <div class="email-wrapper">
              <div class="card">
                <div class="header">
                  <div class="logo">SkiLesson<span>.ai</span></div>
                  <div class="tagline">Expand your skills</div>
                </div>
                
                <div class="content">
                  <h2>📚 New lesson added to your library</h2>
                  
                  <p style="color: #cbd5e1; margin-bottom: 16px;">
                    Great news! A new lesson is now available to help you level up your skiing technique.
                  </p>
                  
                  <div class="lesson-card">
                    <div class="lesson-icon">🎿</div>
                    <div class="lesson-title">${title}</div>
                    <div class="lesson-badge">New Release</div>
                  </div>
                  
                  <div style="text-align: center;">
                    <a href="${dashboardUrl}" class="button">
                      Watch lesson now →
                    </a>
                  </div>
                  
                  <div class="feature-list">
                    <div class="feature-item">
                      <span class="feature-icon">✨</span>
                      <span>Pro tips from certified instructors</span>
                    </div>
                    <div class="feature-item">
                      <span class="feature-icon">🎯</span>
                      <span>Step-by-step technique breakdown</span>
                    </div>
                    <div class="feature-item">
                      <span class="feature-icon">🏆</span>
                      <span>Practice drills included</span>
                    </div>
                  </div>
                  
                  <div class="divider"></div>
                  
                  <p style="color: #94a3b8; font-size: 14px; text-align: center;">
                    Complete this lesson and earn XP points toward your next badge! 🎖️
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
                    © ${new Date().getFullYear()} SkiLesson.ai. Keep progressing! 🏔️
                  </p>
                </div>
              </div>
            </div>
          </body>
          </html>
        `,
    });

    console.log("✅ New lesson email sent to:", email);
  } catch (err) {
    console.error("❌ New lesson email failed:", err);
    throw err;
  }
}
export async function sendSubscriptionEmail(email: string) {
  const dashboardUrl = `${process.env.NEXTAUTH_URL}/dashboard`;

  try {
    await resend.emails.send({
      from: "SkiLesson.ai <subscriptions@resend.dev>",
      to: email,
      subject: "🎉 Welcome to SkiLesson.ai Pro! Your subscription is active",
      html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            ${darkEmailStyles}
          </head>
          <body>
            <div class="email-wrapper">
              <div class="card">
                <div class="header">
                  <div class="logo">SkiLesson<span>.ai</span></div>
                  <div class="tagline">Unlock your full potential</div>
                </div>
                
                <div class="content">
                  <div class="success-icon">🎉✨🏔️</div>
                  <h2>Your Pro subscription is active!</h2>
                  
                  <p style="color: #cbd5e1; margin-bottom: 16px; text-align: center;">
                    Welcome to the SkiLesson.ai family! You now have access to all premium features.
                  </p>
                  
                  <div class="subscription-card">
                    <div class="plan-badge">PRO PLAN • ACTIVE</div>
                    <div class="feature-grid">
                      <div class="feature-item">🎥 Unlimited video analysis</div>
                      <div class="feature-item">🤖 AI coaching sessions</div>
                      <div class="feature-item">📊 Advanced progress tracking</div>
                      <div class="feature-item">🎿 Exclusive lesson library</div>
                      <div class="feature-item">👥 Instructor feedback</div>
                      <div class="feature-item">🏆 Achievement badges</div>
                    </div>
                  </div>
                  
                  <div style="text-align: center;">
                    <a href="${dashboardUrl}" class="button">
                      Start your first lesson →
                    </a>
                  </div>
                  
                  <div class="next-steps">
                    <p style="color: #60a5fa; font-weight: 600; margin-bottom: 16px;">📋 Next steps to get started:</p>
                    <div class="step">
                      <span class="step-number">1</span>
                      <span>Upload your first skiing video</span>
                    </div>
                    <div class="step">
                      <span class="step-number">2</span>
                      <span>Get AI-powered technique analysis</span>
                    </div>
                    <div class="step">
                      <span class="step-number">3</span>
                      <span>Receive personalized improvement plan</span>
                    </div>
                    <div class="step">
                      <span class="step-number">4</span>
                      <span>Track your progress and level up!</span>
                    </div>
                  </div>
                  
                  <div class="divider"></div>
                  
                  <p style="color: #94a3b8; font-size: 14px; text-align: center;">
                    💪 <strong>Pro tip:</strong> Complete your profile to get personalized lesson recommendations!
                  </p>
                </div>
                
                <div class="footer">
                  <p>
                    Need help? <a href="${
                      process.env.NEXTAUTH_URL
                    }/support">Contact support</a> • 
                    <a href="${
                      process.env.NEXTAUTH_URL
                    }/billing">Manage subscription</a>
                  </p>
                  <p style="font-size: 12px;">
                    © ${new Date().getFullYear()} SkiLesson.ai. Ready to shred! 🏔️
                  </p>
                </div>
              </div>
            </div>
          </body>
          </html>
        `,
    });

    console.log("✅ Subscription email sent to:", email);
  } catch (err) {
    console.error("❌ Subscription email failed:", err);
    throw err;
  }
}
