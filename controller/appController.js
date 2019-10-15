class freem {
    static signUp(req, res) {
      return res.status(200).json({
          success: "true",
          message:"Hello Aphrodis! This is the start"
          });
    }
}
export default freem;