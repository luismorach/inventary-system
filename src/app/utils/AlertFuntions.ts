import { Alert, AlertListProducts, AlertPay } from "../interfaces/interfaces"
import { ComunicatorComponetsService } from "../services/comunicator/comunicator-componets.service"

export class AlertFunctions {
    constructor(protected comunicatorSvc: ComunicatorComponetsService) { }
    msj: Alert = {
        type: '',
        showAlert: false,
        title: '',
        description: ''
    }
    msjPay: AlertPay = {
        showAlert: true,
        totalAmount: 0,
        totalPaid: 0
    }
    msjListProducts: AlertListProducts = {
        showAlert: true,
        actionType: '',
        currentProducts: [],
        productsList: []
    }
    showModalWarning = (message: string, showWarning?: boolean) => {
        this.msj = { ...this.msj, description: message };
        this.showModal('Warning');
    }

    showModal(type: string) {
        this.msj.showAlert = true
        this.msj.type = type
        this.comunicatorSvc.setInfoAlert(this.msj)
    }

    showModalQuantity = (msj: string) => {
        this.msj = { ...this.msj, title: msj };
        this.showModal('Quantity');
    }
    showModalPayment(alertPay: AlertPay) {
        this.msjPay = alertPay
        this.comunicatorSvc.setInfoAlertPay(alertPay);
    }
    showProductsListAlert(alertListProducts: AlertListProducts) {
        this.msjListProducts = alertListProducts
        this.comunicatorSvc.setInfoAlertListProducts(alertListProducts)
    }
}