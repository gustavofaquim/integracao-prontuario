import logsDAO from "../bd/logsDAO.js";

const homeController = {
    
    index: async(req,res) => {

        const logs = await logsDAO.listaTodos();

        res.render("inicio.ejs", { logs });
    }
}

export default homeController;