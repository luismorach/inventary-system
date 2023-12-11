import { Request, Response } from 'express';
import pool from '../database/database';

class CoinsController {

    public async getAllCoins(req: Request, res: Response) {
        const response = await pool.query('select c.country,c.country_code,l.language,' +
            'l.language_code,c.currency_code,a.currency from countries c  join languages l  on ' +
            'c.language_code= l.language_code join all_coins a on ' +
            'c.currency_code=a.currency_code order by c.country asc')
        res.json(response.rows)
    }
    public async getCoins(req: Request, res: Response) {
        const response = await pool.query('SELECT * FROM coins ORDER BY name ASC')
        res.json(response.rows)
    }
    public async getCoinById(req: Request, res: Response) {
        const id_coin = parseInt(req.params.id_coin)
        const response = await pool.query('SELECT * FROM coins WHERE id_coin=$1 ORDER BY name ASC',
            [id_coin])
        if (response.rowCount > 0) {
            res.json(response.rows)
        } else {
            res.json({
                icon: 'fa-regular fa-circle-xmark',
                title: 'Ocurrió un error inesperado',
                content: 'La moneda que intenta actualizar ya no existe actualice la lista de Coins e intentelo otra vez'
            })
        }
    }
    public async getMainCoin(req: Request, res: Response) {
        const response = await pool.query("SELECT * FROM coins where type='principal'ORDER BY name ASC")
        res.json(response.rows)
    }
    public async createCoin(req: Request, res: Response) {

        const { country, country_code, language, language_code, currency, currency_code } = req.body
        const client = await pool.connect()
        await client.query('BEGIN')
        try {
            await client.query('INSERT INTO all_coins values($1,$2)', [currency_code, currency])
            await client.query('INSERT INTO languages values($1,$2)', [language_code, language])
            await client.query('INSERT INTO countries values($1,$2,$3,$4)',
                [country_code, country, language_code, currency_code]);
            await client.query('COMMIT')
            res.status(200).json({
                icon: 'fa-regular fa-circle-check', title: '¡Coin Registrada!', content: 'La Coin se registró con exito en el sístema'
            })
        } catch (error: any) {
            await client.query('ROLLBACK')
           throw error
        }
    }

    public async actualizarCoin(req: Request, res: Response) {
        const language_code_old = parseInt(req.params.language_code)
        const currency_code_old = parseInt(req.params.currency_code)
        const country_code_old = parseInt(req.params.country_code)
        const { country, country_code, language, language_code, currency, currency_code } = req.body
        await pool.query('UPDATE languages set language=$1,language_code=$2' +
            'WHERE language_code=$3', [language, language_code, language_code_old]);
        await pool.query('UPDATE all_coins set currency=$1,currency_code=$2' +
            'WHERE currency_code=$3', [currency, currency_code, currency_code_old]);
        await pool.query('UPDATE countries set country=$1,country_code=$2' +
            'WHERE country_code=$3', [country, country_code, country_code_old]);

        res.status(200).json({
            icon: 'fa-regular fa-circle-check', title: '¡Coin Actualizada!', content: 'La Coin se actualizó con exito en el sístema'
        })
    }
    public async eliminarCoin(req: Request, res: Response) {
        const country_code_old = parseInt(req.params.country_code_old)
        await pool.query('DELETE FROM countries WHERE country_code=$1', [country_code_old])
        res.status(200).json({
            icon: 'fa-regular fa-circle-check', title: '¡Coin Eliminada!', content: 'La Coin se elimminó con exito del sístema'
        })
    }
}
const coinsController = new CoinsController();
export default coinsController;