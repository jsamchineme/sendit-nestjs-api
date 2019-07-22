import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcryptjs';
import Response from '../../helpers/Response';
import { EXPIRES_IN, PASSWORD_RESET_EXPIRES_IN } from '../../constants/jwtOptions';
import UserEmitter, {
  PASSWORD_RESET_REQUEST,
  PASSWORD_RESET_COMPLETE,
} from '../../helpers/events/UserEmitter';
import { Controller, Post, Body, HttpCode, Req, Param, Delete, Patch, Put } from '@nestjs/common';
import { UserService } from '../../resources/user/user.service';
import { IUserAttributes } from '../../resources/user/user.model';
import { Request } from 'express';
import { IRefreshedTokens } from '../../types/misc';

@Controller()
export class AuthController {
  private refreshedTokens: IRefreshedTokens = {};

  constructor(
    private readonly userService: UserService,
  ) {
    this.clearRefreshedToken();
  }

  @Post('signup')
  async userSignup(@Body() body: IUserAttributes): Promise<object> {
    const newUserData = body;
    const { password } = newUserData;
    const saltRounds = 10;
    const hashedPassword = bcrypt.hashSync(password, saltRounds);

    newUserData.password = hashedPassword;
    newUserData.isAdmin = false;
    newUserData.verified = false;

    const newUser = await this.userService.create(newUserData);
    delete newUser.password;
    return Response.created(newUser);
  }

  @Post('login')
  @HttpCode(200)
  async login(@Body() body: IUserAttributes): Promise<object> {
    const { email, password } = body;

    const user = await this.userService.findByAttribute('email', email);
    let foundCredentials = false;

    if (!user) {
      return Response.wrongCredentials();
    }

    foundCredentials = bcrypt.compareSync(password, user.password);
    if (!foundCredentials) {
      return Response.wrongCredentials();
    }

    const payload = {
      id: user.id,
      email: user.email,
      isAdmin: user.isAdmin,
      token: null,
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: EXPIRES_IN });
    const data = payload;
    data.token = token;

    return Response.success(data);
  }

  @Patch('refresh')
  async refreshToken(@Req() req: Request | any) {
    const refreshedToken = req.headers['x-access-token'] || req.query.token;
    const { decoded } = req;

    const payload = {
      id: decoded.id,
      email: decoded.email,
      isAdmin: decoded.isAdmin,
      date: new Date(),
      token: null,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: EXPIRES_IN });

    const data = payload;
    data.token = token;

    // we will check to see that it exists in the object
    // bearing refresh tokens.
    // if it is found, then return response with a message
    // invalid token
    if (this.refreshedTokens[refreshedToken]) {
      return Response.invalidToken();
    }
    // save the token as a refreshed token
    this.refreshedTokens[refreshedToken] = {
      userId: payload.id,
      refreshedAt: new Date(),
    };

    return Response.success(data);
  }

  clearRefreshedToken() {
    // initialize refreshed tokens for the AuthController
    if (this.refreshedTokens === undefined) {
      this.refreshedTokens = {};
    }
    // delete the refreshed tokens that have exceeded the expiry time
    // from the in memory object capturing refreshed token
    // the EXPIRES_IN constant is presented in seconds
    // convert it to milliseconds
    // the delay method accepts milliseconds
    const deleteInterval = EXPIRES_IN * 1000;

    const instance = this;
    setInterval(() => {
      let createdSeconds: number;
      let secondsDifference: number;
      const nowTime = new Date();
      const tokens = Object.keys(instance.refreshedTokens);

      tokens.forEach((token) => {
        createdSeconds = instance.refreshedTokens[token].refreshedAt.getSeconds();
        secondsDifference = nowTime.getSeconds() - createdSeconds;
        // token is expired
        if (secondsDifference >= EXPIRES_IN) {
          delete instance.refreshedTokens[token];
        }
      });
    }, deleteInterval);
  }

  @Delete('/users/:userId')
  @HttpCode(204)
  async deleteUser(@Param('userId') userId: any): Promise<object> {
    const user = await this.userService.findById(userId);
    if (!user) {
      return Response.notFound();
    }
    const deleted = await this.userService.delete(user.id);
    if (deleted) {
      return Response.noContent();
    }
  }

  @Post('reset')
  async requestPasswordReset(@Body() body: any) {
    const { email } = body;
    const foundUser = await this.userService .where({ email }).getOne();

    let data: any;
    if (foundUser) {
      const payload = {
        id: foundUser.id,
        email: foundUser.email,
      };

      const token = jwt.sign(
        payload,
        process.env.JWT_SECRET_KEY,
        { expiresIn: PASSWORD_RESET_EXPIRES_IN },
      );

      data = {
        message: 'mail has been sent',
      };

      // for internal use only
      // the resetToken should not be returned in production
      // it is only meant to be used in tests
      if (body.scope === 'testing') {
        data.resetToken = token;
      }
      foundUser.token = token;

      UserEmitter.publish(PASSWORD_RESET_REQUEST, foundUser);

      return Response.success(data);
    }
    return Response.notFound();
  }

  @Put('reset')
  async resetPassword(@Body() body: any) {
    const { email, password } = body;
    const foundUser = await this.userService.where({ email }).getOne();

    let data: any;
    if (foundUser) {
      data = { password };
      const saltRounds = 10;
      const hashedPassword = bcrypt.hashSync(password, saltRounds);
      data.password = hashedPassword;
      const user = await this.userService.update(foundUser.id, data);

      UserEmitter.publish(PASSWORD_RESET_COMPLETE, foundUser);

      delete user.isAdmin;
      delete user.password;

      return Response.success(user);
    }
    return Response.notFound();
  }
}
