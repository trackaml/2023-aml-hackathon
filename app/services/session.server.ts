import { createCookieSessionStorage, redirect } from '@remix-run/node'
import assert from 'node:assert'

assert(process.env.SESSION_SECRET, 'SESSION_SECRET must be set')

const isInProductionEnv = process.env.NODE_ENV === 'production'

export const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: '__bsre__session__',
    httpOnly: true,
    path: '/',
    sameSite: 'lax',
    secrets: [process.env.SESSION_SECRET],
    secure: isInProductionEnv,
  },
})

const USER_SESSION_KEY = 'userId'

export async function getSession(request: Request) {
  const cookie = request.headers.get('Cookie')

  return sessionStorage.getSession(cookie)
}

export const { commitSession } = sessionStorage

type UserSessionInput = {
  request: Request
  userId: string
  remember: boolean
  redirectTo: string
}

export async function createUserSession({
  userId,
  redirectTo,
  remember,
  request,
}: UserSessionInput) {
  const session = await getSession(request)

  session.set(USER_SESSION_KEY, userId)

  return redirect(redirectTo, {
    headers: {
      'Set-Cookie': await sessionStorage.commitSession(session, {
        maxAge: remember
          ? 60 * 60 * 24 * 7 // 7 days
          : undefined,
      }),
    },
  })
}
