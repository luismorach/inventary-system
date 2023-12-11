"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = __importDefault(require("../database/database"));
class VentasController {
    async getVentas(req, res) {
        const response = await database_1.default.query('SELECT * FROM sells ORDER BY time DESC ');
        res.json(response.rows);
    }
    async getVentaById(req, res) {
        const id_sell = parseInt(req.params.id_sell);
        const response = await database_1.default.query('SELECT * FROM sells JOIN users ON ' +
            'sells.id_user=users.id_user JOIN clients ON sells.id_client=clients.id_client ' +
            'JOIN registers ON sells.id_client=clients.id_client ' +
            'AND sells.id_sell=$1 ORDER BY time DESC', [id_sell]);
        if (response.rowCount > 0) {
            res.json(response.rows);
        }
        else {
            console.log(req.params.id_sell);
            res.json({
                icon: '',
                title: 'Ocurrió un error inesperado',
                content: 'No existen ventas con el número de ticket especificado'
            });
        }
    }
    async getVentasByDate(req, res) {
        const initialDate = req.params.initialDate;
        const endDate = req.params.endDate;
        console.log(initialDate + ' ' + endDate);
        const response = await database_1.default.query('SELECT * FROM sells JOIN users ON ' +
            'sells.id_user=users.id_user JOIN clients ON sells.id_client=clients.id_client ' +
            'JOIN registers ON registers.id_register=users.id_register ' +
            'AND date>=$1 and date<=$2 ORDER BY date desc,time DESC', [initialDate, endDate]);
        if (response.rowCount > 0) {
            res.json(response.rows);
        }
        else {
            res.json({
                icon: '',
                title: 'Ocurrió un error inesperado',
                content: 'No existen ventas para la fecha especificada'
            });
        }
    }
    async getVentaByDate(req, res) {
        const initialDate = req.params.initialDate;
        const endDate = req.params.endDate;
        const response = await database_1.default.query('SELECT registers.name,users.names_user,users.last_names_user, ' +
            'SUM(sells.total_sell) as total_sell,count(*) as sells,sells.coin,' +
            '(select calcular_costos($1,sells.id_user))as costos FROM sells JOIN users ON ' +
            'sells.id_user=users.id_user JOIN registers ON users.id_register=registers.id_register ' +
            'where sells.date>=$1 and sells.date<=$2 GROUP BY registers.name,users.names_user,users.last_names_user,' +
            'sells.coin,sells.id_user order by users.names_user', [initialDate, endDate]);
        if (response.rowCount > 0) {
            res.json(response.rows);
        }
        else {
            res.json({
                icon: '',
                title: 'Ocurrió un error inesperado',
                content: 'No existen ventas para la fecha especificada'
            });
        }
    }
    async getVentasByUser(req, res) {
        const names = '%' + req.params.names + '%';
        console.log(names);
        const response = await database_1.default.query("SELECT * FROM sells JOIN users ON " +
            "sells.id_user=users.id_user JOIN clients ON sells.id_client=clients.id_client " +
            "AND names_user ilike $1 or last_names_user ilike $1", [names]);
        res.json(response.rows);
    }
    async getVentasByClient(req, res) {
        const names = '%' + req.params.names + '%';
        console.log(names);
        const response = await database_1.default.query("SELECT * FROM sells JOIN users ON " +
            "sells.id_user=users.id_user JOIN clients ON sells.id_client=clients.id_client " +
            "AND names_client ilike $1 or last_names_client ilike $1", [names]);
        res.json(response.rows);
    }
    async getProductosVentaById(req, res) {
        const id_sell = parseInt(req.params.id_sell);
        const response = await database_1.default.query('SELECT * FROM products JOIN sell_products ON ' +
            'sell_products.id_product=products.id_product AND id_sell=$1', [id_sell]);
        if (response.rowCount > 0) {
            res.json(response.rows);
        }
    }
    async getProductoVentaById(req, res) {
        console.log('consulta');
        const id_sell = parseInt(req.params.id_sell);
        const id_product = parseInt(req.params.id_product);
        const response = await database_1.default.query('SELECT * FROM sell_products where id_sell=$1 and id_product=$2', [id_sell, id_product]);
        if (response.rowCount > 0) {
            res.json(response.rows);
        }
    }
    async getPagosVentaById(req, res) {
        const id_sell = parseInt(req.params.id_sell);
        const response = await database_1.default.query('SELECT * FROM pays JOIN users ON ' +
            'pays.id_user=users.id_user JOIN registers ON users.id_register=registers.id_register ' +
            'AND id_sell=$1', [id_sell]);
        if (response.rowCount > 0) {
            res.json(response.rows);
        }
    }
    async getPagosVentaByDate(req, res) {
        const initialDate = req.params.initialDate;
        const endDate = req.params.endDate;
        const response = await database_1.default.query("SELECT name,symbol,(select coalesce((select sum(mount) " +
            "from pays where date>=$1 and date<=$2 and type='Efectivo' and coin=coins.symbol),0)) " +
            "as efectivo,(select coalesce((select sum(mount) from pays where date>=$1 and date<=$2 " +
            "and type='Transacción eléctronica' and coin=coins.symbol),0)) as transaccion from coins " +
            "group by name,symbol", [initialDate, endDate]);
        if (response.rowCount > 0) {
            res.json(response.rows);
        }
        else {
            res.json({
                transaccion: 0, efectivo: 0
            });
        }
    }
    async createVenta(req, res) {
        const { total_sell, coin, exchange, state, discount, type_sell, total_pay, id_user, id_client, sell_products, pays } = req.body;
        const client = await database_1.default.connect();
        await client.query('BEGIN');
        try {
            let response = await client.query('INSERT INTO sells (total_sell,coin,exchange,state,' +
                'discount,type_sell,total_pay,id_user,id_client) values($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING id_sell', [total_sell, coin, exchange, state, discount, type_sell, total_pay, id_user, id_client]);
            sell_products.forEach(async (data) => {
                await client.query('INSERT INTO sell_products (id_sell,id_product,buy_price,sell_price,' +
                    'discount_product,impuest,quantity_products,exist_products,quantity_back)' +
                    'values($1,$2,$3,$4,$5,$6,$7,$8,$9)', [response.rows[0].id_sell, data.id_product, data.buy_price,
                    data.sell_price, data.discount_product, data.impuest, data.quantity_products,
                    data.exist_products - data.quantity_products, data.quantity_back]);
            });
            pays.forEach(async (data) => {
                await client.query('INSERT INTO pays (id_sell,type,reference,' +
                    'mount,coin,exchange,id_user) values($1,$2,$3,$4,$5,$6,$7)', [response.rows[0].id_sell, data.type, data.reference, data.mount, data.coin,
                    data.exchange, data.id_user]);
            });
            await client.query('COMMIT');
            res.status(200).json({
                icon: '', title: '¡Venta Registrada!', content: 'La venta se registró con exito en el sístema'
            });
        }
        catch (error) {
            await client.query('ROLLBACK');
            throw error;
        }
        finally {
            client.release();
        }
    }
    async actualizarVenta(req, res) {
        const id_sell = parseInt(req.params.id_sell);
        const { total_buy, id_provider, id_user } = req.body;
        await database_1.default.query('UPDATE sells SET total_sell=$1 WHERE id_sell=$1', [total_buy, id_provider, id_user, id_sell]);
        res.status(200).json({
            icon: '', title: '¡Venta Actualizada!', content: 'La Venta se actualizó con exito en el sístema'
        });
    }
    async actualizarProductosVenta(req, res) {
        const id_sell_old = parseInt(req.params.id_sell);
        const id_product_old = parseInt(req.params.id_product);
        const { id_sell, id_product, buy_price, sell_price, weighted_averages, quantity_products, exist_products, quantity_back } = req.body;
        await database_1.default.query('UPDATE buy_products set id_sell=$1,id_product=$2,buy_price=$3,sell_price=$4,' +
            'weighted_averages=$5,quantity_products=$6,exist_products=$7,quantity_back=$8 where id_sell=$9 and id_product=$10', [id_sell, id_product, buy_price, sell_price, weighted_averages, quantity_products,
            exist_products, quantity_back, id_sell_old, id_product_old]);
        res.status(200).json({
            icon: '', title: '¡Venta Actualizada!', content: 'La Venta se actualizó con exito en el sístema'
        });
    }
    async eliminarVenta(req, res) {
        const id_sell = parseInt(req.params.id_sell);
        await database_1.default.query('DELETE FROM sells WHERE id_sell=$1', [id_sell]);
        res.status(200).json({
            icon: '', title: '¡Venta Eliminada!', content: 'La Venta se eliminó con exito del sístema'
        });
    }
}
const ventasController = new VentasController();
exports.default = ventasController;
