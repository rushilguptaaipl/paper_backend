import { cp } from "fs";
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn, Timestamp } from "typeorm";

@Entity()
export class Otp extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: 'varchar',
        length: 14,
        default: null,
    })
    mobile: string;

    @Column({
        type: 'varchar',
        length: 4,
        default: null,
    })
    country_code: string;

    @Column({
        type: 'varchar',
        length: 100,
        default: null
    })
    email: string;

    @Column({
        type: 'integer',
        default: null,
    })
    otp: number;

    @Column({
        type: 'boolean',
        default: false,
    })
    is_verified: Boolean;

    @Column({
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP',
    })
    created_at: Timestamp;

    @Column({
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP',
    })
    updated_at: Timestamp;

    @Column({
        type: 'timestamp',
        default: null,
    })
    expired_at: Date;
}