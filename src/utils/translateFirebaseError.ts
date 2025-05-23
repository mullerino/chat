export function translateFirebaseError(message: string): string {
  const mensagens: Record<string, string> = {
    'auth/user-not-found': 'Usuário não encontrado.',
    'auth/wrong-password': 'Senha incorreta.',
    'auth/invalid-email': 'E-mail inválido.',
    'auth/invalid-credential': 'Credenciais inválidas.',
    'auth/email-already-in-use': 'Este e-mail já está em uso.',
    'auth/weak-password': 'A senha deve ter pelo menos 6 caracteres.',
    'auth/missing-password': 'Informe a senha.',
    'auth/missing-email': 'Informe o e-mail.',
    'auth/too-many-requests': 'Muitas tentativas. Tente novamente mais tarde.',
  };

  const match = Object.entries(mensagens).find(([code]) =>
    message.includes(code)
  );

  return match?.[1] || 'Ocorreu um erro. Tente novamente.';
}
