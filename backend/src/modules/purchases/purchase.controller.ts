import { Request, Response } from 'express';
import { PurchaseService, CreatePurchaseRequest, UpdatePurchaseRequest } from './purchase.service';
import { AppError } from '../../utils/appError';

export class PurchaseController {
  private purchaseService: PurchaseService;

  constructor() {
    this.purchaseService = new PurchaseService();
  }

  // GET /purchases
  async getAllPurchases(req: Request, res: Response) {
    try {
      const params = {
        page: parseInt(req.query.page as string) || 1,
        limit: parseInt(req.query.limit as string) || 10,
        sortBy: req.query.sortBy as string || 'createdAt',
        sortOrder: (req.query.sortOrder as 'ASC' | 'DESC') || 'DESC',
        status: req.query.status as any,
        category: req.query.category as any,
        requestedBy: req.query.requestedBy as string,
        startDate: req.query.startDate as string,
        endDate: req.query.endDate as string,
        search: req.query.search as string
      };

      const result = await this.purchaseService.getAllPurchases(params);

      res.status(200).json({
        success: true,
        message: 'Compras obtenidas exitosamente',
        data: result.data,
        pagination: result.pagination
      });
    } catch (error) {
      console.error('Error fetching purchases:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener las compras',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // GET /purchases/:id
  async getPurchaseById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const purchase = await this.purchaseService.getPurchaseById(id);

      res.status(200).json({
        success: true,
        message: 'Compra obtenida exitosamente',
        data: purchase
      });
    } catch (error) {
      console.error('Error fetching purchase:', error);
      if (error instanceof AppError) {
        res.status(error.statusCode).json({
          success: false,
          message: error.message
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Error al obtener la compra',
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }
  }

  // POST /purchases
  async createPurchase(req: Request, res: Response) {
    try {
      const purchaseData: CreatePurchaseRequest = req.body;
      const purchase = await this.purchaseService.createPurchase(purchaseData);

      res.status(201).json({
        success: true,
        message: 'Compra creada exitosamente',
        data: purchase
      });
    } catch (error) {
      console.error('Error creating purchase:', error);
      if (error instanceof AppError) {
        res.status(error.statusCode).json({
          success: false,
          message: error.message
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Error al crear la compra',
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }
  }

  // PUT /purchases/:id
  async updatePurchase(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const updateData: UpdatePurchaseRequest = req.body;
      const purchase = await this.purchaseService.updatePurchase(id, updateData);

      res.status(200).json({
        success: true,
        message: 'Compra actualizada exitosamente',
        data: purchase
      });
    } catch (error) {
      console.error('Error updating purchase:', error);
      if (error instanceof AppError) {
        res.status(error.statusCode).json({
          success: false,
          message: error.message
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Error al actualizar la compra',
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }
  }

  // DELETE /purchases/:id
  async deletePurchase(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await this.purchaseService.deletePurchase(id);

      res.status(200).json({
        success: true,
        message: 'Compra eliminada exitosamente'
      });
    } catch (error) {
      console.error('Error deleting purchase:', error);
      if (error instanceof AppError) {
        res.status(error.statusCode).json({
          success: false,
          message: error.message
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Error al eliminar la compra',
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }
  }

  // GET /purchases/stats
  async getPurchaseStats(req: Request, res: Response) {
    try {
      const { startDate, endDate } = req.query;
      const stats = await this.purchaseService.getPurchaseStats(
        startDate as string,
        endDate as string
      );

      res.status(200).json({
        success: true,
        message: 'Estadísticas de compras obtenidas exitosamente',
        data: stats
      });
    } catch (error) {
      console.error('Error fetching purchase stats:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener las estadísticas de compras',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // POST /purchases/:id/approve
  async approvePurchase(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { approvedBy } = req.body;
      
      if (!approvedBy) {
        return res.status(400).json({
          success: false,
          message: 'ID del usuario que aprueba es requerido'
        });
      }

      const purchase = await this.purchaseService.approvePurchase(id, approvedBy);

      res.status(200).json({
        success: true,
        message: 'Compra aprobada exitosamente',
        data: purchase
      });
    } catch (error) {
      console.error('Error approving purchase:', error);
      if (error instanceof AppError) {
        res.status(error.statusCode).json({
          success: false,
          message: error.message
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Error al aprobar la compra',
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }
  }

  // POST /purchases/:id/reject
  async rejectPurchase(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { rejectionReason, approvedBy } = req.body;
      
      if (!rejectionReason || !approvedBy) {
        return res.status(400).json({
          success: false,
          message: 'Razón de rechazo e ID del usuario son requeridos'
        });
      }

      const purchase = await this.purchaseService.rejectPurchase(id, rejectionReason, approvedBy);

      res.status(200).json({
        success: true,
        message: 'Compra rechazada exitosamente',
        data: purchase
      });
    } catch (error) {
      console.error('Error rejecting purchase:', error);
      if (error instanceof AppError) {
        res.status(error.statusCode).json({
          success: false,
          message: error.message
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Error al rechazar la compra',
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }
  }

  // POST /purchases/:id/complete
  async completePurchase(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { actualDeliveryDate } = req.body;
      
      const purchase = await this.purchaseService.completePurchase(id, actualDeliveryDate);

      res.status(200).json({
        success: true,
        message: 'Compra completada exitosamente',
        data: purchase
      });
    } catch (error) {
      console.error('Error completing purchase:', error);
      if (error instanceof AppError) {
        res.status(error.statusCode).json({
          success: false,
          message: error.message
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Error al completar la compra',
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }
  }

  // POST /purchases/:id/cancel
  async cancelPurchase(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { cancellationReason } = req.body;
      
      const purchase = await this.purchaseService.cancelPurchase(id, cancellationReason);

      res.status(200).json({
        success: true,
        message: 'Compra cancelada exitosamente',
        data: purchase
      });
    } catch (error) {
      console.error('Error cancelling purchase:', error);
      if (error instanceof AppError) {
        res.status(error.statusCode).json({
          success: false,
          message: error.message
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Error al cancelar la compra',
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }
  }

  // GET /purchases/status/:status
  async getPurchasesByStatus(req: Request, res: Response) {
    try {
      const { status } = req.params;
      const purchases = await this.purchaseService.getPurchasesByStatus(status as any);

      res.status(200).json({
        success: true,
        message: `Compras con estado ${status} obtenidas exitosamente`,
        data: purchases
      });
    } catch (error) {
      console.error('Error fetching purchases by status:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener las compras por estado',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // GET /purchases/requester/:requestedBy
  async getPurchasesByRequester(req: Request, res: Response) {
    try {
      const { requestedBy } = req.params;
      const purchases = await this.purchaseService.getPurchasesByRequester(requestedBy);

      res.status(200).json({
        success: true,
        message: 'Compras del solicitante obtenidas exitosamente',
        data: purchases
      });
    } catch (error) {
      console.error('Error fetching purchases by requester:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener las compras del solicitante',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
}
