import { z } from "zod";
import { todoInput } from "~/types";
import {createTRPCRouter,protectedProcedure} from "~/server/api/trpc";

//This is the Router for the Todo application
export const todoRouter = createTRPCRouter({
  //Endpoint for the all todo
  all: protectedProcedure
  .query(async ({ ctx }) => {
    const todos = await ctx.prisma.todo.findMany({
      where: {
        userId: ctx.session.user.id,
      },
    });
    return todos;
  }),

    //Endpoint for creating the todo
  create: protectedProcedure
    .input(todoInput)
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.todo.create({
        data: {
          text: input,
          done: false,
          user: {
            connect: {
              id: ctx.session.user.id,
            },
          },
        },
      });
    }),

  //Endpoint for deleting the todo
  delete: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.todo.delete({
        where: {
          id: input,
        },
      });
    }),
  
  //Endpoint for toggle the checkbox
  toggle: protectedProcedure
    .input(
      //this is the type schema using the zod.
      z.object({ 
        id: z.string(),
      done: z.boolean(),
     })
     )
    .mutation(async ({ ctx,  input:{id,done} }) => {
      return ctx.prisma.todo.update({
        where: {
          id,
        },
        data:{
          done,
        },
      });
    }),
});
