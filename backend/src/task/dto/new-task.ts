import { IsNotEmpty } from "class-validator";

export class NewTaskDto {
    @IsNotEmpty({ message: 'Title is required' })
    title: string;
}