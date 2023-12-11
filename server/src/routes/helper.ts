import {NextFunction, Request,Response} from 'express'

function routeHelper(callback: any) {
    return async (req: Request, res: Response) => {
        try {
            await callback(req,res)
        } catch (error:any) {
            res.json({ icon:'fa-regular fa-circle-xmark',
            title:'Ocurrió un error inesperado',
            content: error.message})
        }
    } 
}
function errorMiddleware(error: Error, req: Request, res: Response, next: NextFunction) {
    res.json({ icon:'fa-regular fa-circle-xmark',
    title:'Ocurrió un error inesperado',
    content: error.message })
}
module.exports={
    routeHelper,
    errorMiddleware
}