import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../users/user.entity';

export enum PurchaseStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

export enum PurchaseCategory {
  OFFICE_SUPPLIES = 'office_supplies',
  EDUCATIONAL_MATERIALS = 'educational_materials',
  TECHNOLOGY = 'technology',
  MAINTENANCE = 'maintenance',
  CLEANING_SUPPLIES = 'cleaning_supplies',
  FOOD_SERVICES = 'food_services',
  TRANSPORTATION = 'transportation',
  OTHER = 'other'
}

export enum PaymentMethod {
  CASH = 'cash',
  BANK_TRANSFER = 'bank_transfer',
  CHECK = 'check',
  CREDIT_CARD = 'credit_card',
  OTHER = 'other'
}

@Entity('purchases')
export class Purchase {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 255 })
  title!: string;

  @Column({ type: 'text' })
  description!: string;

  @Column({ type: 'enum', enum: PurchaseCategory })
  category!: PurchaseCategory;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  amount!: number;

  @Column({ type: 'varchar', length: 100, nullable: true })
  supplier?: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  invoiceNumber?: string;

  @Column({ type: 'enum', enum: PaymentMethod, default: PaymentMethod.CASH })
  paymentMethod!: PaymentMethod;

  @Column({ type: 'enum', enum: PurchaseStatus, default: PurchaseStatus.PENDING })
  status!: PurchaseStatus;

  @Column({ type: 'date' })
  purchaseDate!: Date;

  @Column({ type: 'date', nullable: true })
  expectedDeliveryDate?: Date;

  @Column({ type: 'date', nullable: true })
  actualDeliveryDate?: Date;

  @Column({ type: 'text', nullable: true })
  notes?: string;

  @Column({ type: 'text', nullable: true })
  rejectionReason?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  attachments?: string;

  @Column({ type: 'uuid' })
  requestedBy!: string;

  @Column({ type: 'uuid', nullable: true })
  approvedBy?: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  // Relations
  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: 'requestedBy' })
  requester?: User;

  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: 'approvedBy' })
  approver?: User;
}
