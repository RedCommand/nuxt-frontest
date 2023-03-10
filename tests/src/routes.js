/**
 * @param {string[]} exclude list of route to exclude from the test.
 * @return {string[]} The list of all the routes generated by the router
 */
const getRoutes = async (exclude = null) => {
  return ['/', '/get-started']
}

module.exports = { getRoutes }
