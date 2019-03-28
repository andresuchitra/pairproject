// module.exports = (req, res, next) => {
//     if (!req.session.isAdmin) {
//         req.session.onlyAdmin = 'Sorry! admins only :('
//         res.redirect('/')
//     } else {
//         next()
//     }
// }