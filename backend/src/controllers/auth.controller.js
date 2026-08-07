export const checkAuth = async (req, res, next) => {
    const user = req.user
    
    if (!user) {
        res.status(401).json({ msg:"Unauthorized" })
        return
    }

    res.status(200).json(user)
}