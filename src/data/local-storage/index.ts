const MY_ID_KEY = 'my-id'

export function setMyId(id: string) {
  localStorage.setItem(MY_ID_KEY, id)
}

export function getMyId() {
  return localStorage.getItem(MY_ID_KEY)
}
