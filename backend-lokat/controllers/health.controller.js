export const healthcheck = async (req, res) => {
    return res.status(200).json({ message: "OK", date: Date.now() })
}
