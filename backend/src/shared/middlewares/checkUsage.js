import { prisma } from '../../shared/config/db.js'

export function checkUsage(resource) {
    return async(req, res, next) => {
        try {
            
            const userId = req.user_id;

            let subscription = await prisma.subscriptions.findFirst({
                where: {
                    client: { userId },
                    status: "active"
                },
                include: {
                    plan: true
                }
            });

            const usage = await prisma.usage.findUnique({ where: { userId } });

            if (!subscription) {
                console.log("Usuário sem assinatura ativa, verificando plano free");
                const freePlan = await prisma.plan.findFirst({
                    where: { codigo: "free" },
                });
            
                if (!freePlan) {
                    return res.status(403).json({ message: "Assinatura necessária" });
                }
            
                // monta um objeto parecido com subscription para o resto do código funcionar
                subscription = { plan: freePlan, currentPeriodEnd: usage.periodEnd };
            };

            const resources = subscription.plan.resources;
            const resourecsObject = JSON.parse(resources);

            console.log("resources", resources);

            // verifica se o recurso está liberado no plano
            if (resource === "acessCronograma") {
                if (resourecsObject.cronogramAccess) {
                    return next();
                }

                return res.status(403).json({ 
                    message: "Ops...",
                    description: "Não é possivel criar cronogramas com o plano gratuito",
                    limit: 0,
                    used: 0,
                    permission: false
                 });
            }

            // pega o limite correto baseado no resource

            const limitMap = {
                cronogramas: resourecsObject.cronogramAmount,
                questoes: resourecsObject.questionAmount,
            };

            const limit = limitMap[resource];

            // zera se o período expirou
            if (new Date() > usage.periodEnd) {
                await prisma.usage.update({
                where: { userId },
                data: {
                    questoes: 0,
                    cronogramas: 0,
                    periodEnd: subscription.currentPeriodEnd,
                },
                });
                return next();
            }

            // verifica se bateu no limite
            if (usage[resource] >= limit) {
                return res.status(403).json({
                message: `Limite de ${resource} atingido`,
                limit,
                used: usage[resource],
                resetAt: usage.periodEnd,
                });
            }

            // incrementa
            await prisma.usage.update({
                where: { userId },
                data: { [resource]: { increment: 1 } },
            });

            next();

        } catch (error) {
            return res.status(500).json({ message: "Erro ao verificar uso", error: error.message });
        }
    }
}