import { Body, Controller, Get, Path, Post, Query, Route, SuccessResponse } from 'tsoa';
import type { User } from './user';
import { UsersService, type UserCreationParams } from './usersService';

@Route('v1/users')
export class UsersController extends Controller {
	@Get()
	public async getUsers(): Promise<User[]> {
		// For demonstration, return a list with a single user
		return [new UsersService().get(1)];
	}

	@Get('{userId}')
	public async getUser(@Path() userId: number, @Query() name?: string): Promise<User> {
		return new UsersService().get(userId, name);
	}

	@SuccessResponse('201', 'Created') // Custom success response
	@Post()
	public async createUser(@Body() requestBody: UserCreationParams): Promise<void> {
		this.setStatus(201); // set return status 201
		new UsersService().create(requestBody);
		return;
	}
}
