// 'use server'
//
// import { Resend } from 'resend'
// import type { ContactUsFormSchema } from './contactUsFormSchema'
// import contactFormSchema from './contactUsFormSchema'
// import EmailTemplate from './email-template'
//
// const resend = new Resend(process.env.RESEND_API_KEY)
//
// export async function sendEmailToElixir(values: ContactUsFormSchema) {
//  console.log(values)
//  const validatedValues = contactFormSchema.safeParse(values)
//  if (!validatedValues.success) {
//    return { error: validatedValues.error }
//  }
//  try {
//    const { data, error } = await resend.emails.send({
//      to: ['support@elixir.no'],
//      from: 'Pathogen Portal Norway <no-reply@pathogens.no>',
//      subject: validatedValues.data.subject,
//      react: EmailTemplate({
//        firstName: validatedValues.data.firstName,
//        lastName: validatedValues.data.lastName,
//        email: validatedValues.data.email,
//        message: validatedValues.data.message,
//      }),
//    })
//    if (error) {
//      return { error: error }
//    }
//    return { success: true, data: data }
//  } catch (error) {
//    return { error }
//  }
// }
