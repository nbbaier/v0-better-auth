// This simulates Better Auth behavior for demo purposes

interface User {
  id: string
  email: string
  name: string
}

interface Session {
  user: User
  expiresAt: number
}

// Simulate localStorage-based session management
const SESSION_KEY = "auth_session"
const OTP_KEY = "auth_otp"

const otpStore = new Map<string, { code: string; name: string; expiresAt: number }>()

class MockAuthClient {
  async getSession(): Promise<{ user: User } | null> {
    try {
      const sessionData = localStorage.getItem(SESSION_KEY)
      if (!sessionData) return null

      const session: Session = JSON.parse(sessionData)

      // Check if session is expired
      if (session.expiresAt < Date.now()) {
        localStorage.removeItem(SESSION_KEY)
        return null
      }

      return { user: session.user }
    } catch (error) {
      console.error("[v0] Failed to get session:", error)
      return null
    }
  }

  async sendOTP(email: string, name: string): Promise<{ success: boolean; code?: string }> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Generate a 6-digit OTP
    const code = Math.floor(100000 + Math.random() * 900000).toString()

    // Store OTP with name and 5-minute expiration
    otpStore.set(email, {
      code,
      name,
      expiresAt: Date.now() + 5 * 60 * 1000,
    })

    // In a real app, this would be sent via email
    console.log(`[v0] OTP for ${email}: ${code}`)

    return { success: true, code }
  }

  async verifyOTP(email: string, code: string): Promise<{ user: User } | null> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    const otpData = otpStore.get(email)

    if (!otpData) {
      throw new Error("No OTP found for this email")
    }

    if (otpData.expiresAt < Date.now()) {
      otpStore.delete(email)
      throw new Error("OTP has expired")
    }

    if (otpData.code !== code) {
      throw new Error("Invalid OTP")
    }

    // OTP is valid, create session
    otpStore.delete(email)

    const user: User = {
      id: Math.random().toString(36).substring(7),
      email,
      name: otpData.name,
    }

    const session: Session = {
      user,
      expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
    }

    localStorage.setItem(SESSION_KEY, JSON.stringify(session))

    return { user }
  }

  async sendMagicLink(email: string, name: string): Promise<{ success: boolean }> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Generate a magic link token
    const token = Math.random().toString(36).substring(2)

    // Store token with email and name
    localStorage.setItem(
      `magic_link_${token}`,
      JSON.stringify({
        email,
        name,
        expiresAt: Date.now() + 15 * 60 * 1000, // 15 minutes
      }),
    )

    // In a real app, this would be sent via email with a link
    const magicLink = `${window.location.origin}?token=${token}`
    console.log(`[v0] Magic link for ${email}: ${magicLink}`)

    return { success: true }
  }

  async verifyMagicLink(token: string): Promise<{ user: User } | null> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    const tokenData = localStorage.getItem(`magic_link_${token}`)

    if (!tokenData) {
      throw new Error("Invalid magic link")
    }

    const { email, name, expiresAt } = JSON.parse(tokenData)

    if (expiresAt < Date.now()) {
      localStorage.removeItem(`magic_link_${token}`)
      throw new Error("Magic link has expired")
    }

    // Magic link is valid, create session
    localStorage.removeItem(`magic_link_${token}`)

    const user: User = {
      id: Math.random().toString(36).substring(7),
      email,
      name,
    }

    const session: Session = {
      user,
      expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
    }

    localStorage.setItem(SESSION_KEY, JSON.stringify(session))

    return { user }
  }

  async signOut(): Promise<void> {
    localStorage.removeItem(SESSION_KEY)
  }
}

export const authClient = new MockAuthClient()
