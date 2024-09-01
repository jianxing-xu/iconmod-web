export function mfetch(url: string, opts?: RequestInit) {
  const headers = {
    'Content-Type': 'application/json',
    ...(opts?.headers || {}),
  }
  const init = Object.assign({
    headers,
    credentials: 'include',
  }, opts ?? {})
  return fetch(url, init)
}
