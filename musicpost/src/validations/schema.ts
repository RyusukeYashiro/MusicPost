import { z } from 'zod';

export const formSchema = z.object({
    username: z.string()
        .min(1, { message: '最低でも１文字以上である必要があります' })
        .max(32, { message: 'ユーザー名が３２文字を超えています' }),
    email: z.string()
        .email('有効なメールアドレスを入力してください'),
    password: z.string()
        .min(6, { message: '最低でも６文字以上である必要があります' })
        .regex(/[0-9]+/, { message: '最低でも数字を1文字含める必要があります' }),
    confPass : z.string()
}).refine((val) => val.password === val.confPass , {
    message : 'パスワードが一致しません',
    path : ['confPass'],
});

export type FormSchemaData = z.infer<typeof formSchema>;