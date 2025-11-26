import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Categoria } from "../../categoria/entities/categoria.entity";
import { PedidoProducto } from "../../pedido/entities/pedido.producto.entity";


@Entity('productos')

export class Producto {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({type: 'varchar', length: 250})
    nombre: string;

    @Column({type: 'decimal', precision: 10, scale: 2})
    precio: number;

    @Column({type: 'int'})
    stock: number;

    @Column({type: 'varchar', length: 250, nullable: true})
    image: string;

    @Column({type: 'text', nullable: true})
    descripcion: string;

    @Column({type: 'boolean', default: true})
    estado: boolean;


    @ManyToOne(() =>Categoria, (cat) => cat.productos)
    categoria: Categoria;

    @OneToMany(() => PedidoProducto, pedprod => pedprod.producto)
    pedidoProducto: PedidoProducto[];

}
