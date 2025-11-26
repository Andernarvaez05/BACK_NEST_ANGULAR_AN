import { HttpException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginAuthDto } from './dto/login-auth.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { Repository } from 'typeorm';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { hash , compare } from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(private jwtService: JwtService,
        @InjectRepository(User) private userRepository: Repository<User>
    ){}

    async funRegister(objUser: RegisterAuthDto){
        const {password} = objUser;//CAPTURAMOS SOLO PASSWORD DE TDO EL OBJETO
        //console.log("Antes: ", objUser)
        const plainToHash = await hash(password, 12)//Para encriptar la contraseña
        //console.log(plainToHash); //imprimimos el hash

        // map DTO `email` -> entity `mail` to satisfy DB column
        const userToSave: Partial<User> = {
            email: (objUser as any).email,
            password: plainToHash
        };

        return this.userRepository.save(userToSave as User); //Guardamos el usuario en la base de datos
    }
    async login(credenciales:LoginAuthDto){

       const {email,password} = credenciales as any;

       const user = await this.userRepository.findOne({ where: { email: email } });
       if(!user) throw new HttpException('usuario no encontrado', 404);

       const verificarPass = await compare(password, user.password);
       if(!verificarPass) throw new HttpException('Password invalido', 401);

       const payload = { email: user.email, id: user.id };
       const token = this.jwtService.sign(payload);
       return { user: user, token };

    }
}
