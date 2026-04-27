/**
 * Schemas zod para validação client-side dos formulários de autenticação.
 *
 * As regras espelham as validações do backend (Marshmallow), garantindo
 * que o usuário receba feedback imediato sem precisar fazer round-trip
 * para descobrir que a senha é curta ou que o e-mail é inválido.
 */

import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email({ message: 'E-mail inválido' }),
  senha: z.string().min(1, { message: 'Senha é obrigatória' }),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

export const registerSchema = z
  .object({
    nome: z.string().min(1, { message: 'Nome é obrigatório' }).max(100),
    sobrenome: z.string().min(1, { message: 'Sobrenome é obrigatório' }).max(100),
    email: z.string().email({ message: 'E-mail inválido' }),
    telefone: z
      .string()
      .min(5, { message: 'Telefone muito curto' })
      .max(30, { message: 'Telefone muito longo' }),
    senha: z
      .string()
      .min(8, { message: 'Senha precisa ter pelo menos 8 caracteres' }),
    confirmarSenha: z.string(),
    dataNascimento: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, { message: 'Data inválida (use AAAA-MM-DD)' }),
    sexo: z.enum(['masculino', 'feminino', 'outro']),
    pais: z.string().min(1, { message: 'País é obrigatório' }).max(100),
  })
  .refine((data) => data.senha === data.confirmarSenha, {
    message: 'As senhas informadas não conferem',
    path: ['confirmarSenha'],
  });

export type RegisterFormValues = z.infer<typeof registerSchema>;
