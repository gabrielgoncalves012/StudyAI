import jsonwebtoken from 'jsonwebtoken';

const verifyJwt = (req, res, next) => {
    const authHeader = req.headers['authorization'];

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Acesso negado. Não há nenhum token' });
    }

    const token = authHeader.split(' ')[1]; // Extrai o token após 'Bearer '

    try {
        const SECRET_KEY = process.env.SECRET_KEY;
        if (!SECRET_KEY) {
            throw new Error('SECRET_KEY is not defined in the environment variables.');
        }

        const decoded = jsonwebtoken.verify(token, SECRET_KEY);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(403).json({ message: 'Token invalido.', error: err.message });
    }
};

export default verifyJwt;