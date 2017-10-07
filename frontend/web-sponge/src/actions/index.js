export const clickSomething = filter => {
  console.log('[clickSomething]')
  return {
    type: 'CLICKED_SOMETHING',
    filter
  }
}
