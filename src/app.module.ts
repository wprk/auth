import { ConfigModule, ConfigService } from '@nestjs/config'
import { Module } from '@nestjs/common'
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm'

import auth from './config/auth.config'
import database from './config/database.config'
import server from './config/server.config'
import { RoutesModule } from './modules/routes.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [auth, database, server],
    }),
    RoutesModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) =>
        ({
          type: configService.get('database.type'),
          host: configService.get('database.host'),
          port: configService.get<number>('database.port'),
          username: configService.get('database.username', 'postgres'),
          password: configService.get('database.password', 'postgres'),
          database: configService.get('database.database', 'public'),
          entities: configService.get('database.entities', []),
          autoLoadEntities: configService.get('database.auto_load_entities', true),
          logging: configService.get('database.logging', false),
          ssl: configService.get<boolean>('database.use_ssl', true),
        } as TypeOrmModuleOptions),
    }),
  ],
  controllers: [],
})
export class AppModule {}
