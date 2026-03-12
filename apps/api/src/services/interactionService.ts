import prisma from "../prisma";

export class InteractionService {
  /**
   * Add or update a rating for a specific resource by a user
   */
  static async addOrUpdateRating(userId: string, resourceId: string, score: number, review?: string) {
    const resource = await prisma.resource.findUnique({ where: { id: resourceId } });
    if (!resource) throw new Error("RESOURCE_NOT_FOUND");

    // Upsert rating
    const rating = await prisma.rating.upsert({
      where: {
        userId_resourceId: {
          userId,
          resourceId
        }
      },
      create: {
        userId,
        resourceId,
        score,
        review
      },
      update: {
        score,
        review
      }
    });

    // Recalculate average rating
    const agg = await prisma.rating.aggregate({
      where: { resourceId },
      _avg: { score: true }
    });

    const newAvg = agg._avg.score || 0;

    // Update resource's cached average rating
    await prisma.resource.update({
       where: { id: resourceId },
       data: { avgRating: newAvg }
    });

    return { rating, averageRating: newAvg };
  }

  /**
   * Get formatting rating data for a resource
   */
  static async getResourceRatings(resourceId: string, userId?: string) {
    const agg = await prisma.rating.aggregate({
      where: { resourceId },
      _avg: { score: true },
      _count: { score: true }
    });

    let userRating = null;
    if (userId) {
      const existing = await prisma.rating.findUnique({
        where: { userId_resourceId: { userId, resourceId } }
      });
      if (existing) userRating = existing;
    }

    return {
      averageRating: agg._avg.score || 0,
      ratingCount: agg._count.score || 0,
      userRating
    };
  }

  /**
   * Add a new comment to a resource
   */
  static async addComment(userId: string, resourceId: string, text: string) {
    const resource = await prisma.resource.findUnique({ where: { id: resourceId } });
    if (!resource) throw new Error("RESOURCE_NOT_FOUND");

    return prisma.comment.create({
      data: {
        userId,
        resourceId,
        text
      },
      include: {
        user: {
          select: { username: true, profileImage: true, college: true }
        }
      }
    });
  }

  /**
   * Fetch all comments for a resource
   */
  static async getComments(resourceId: string) {
    return prisma.comment.findMany({
      where: { resourceId },
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: { username: true, profileImage: true, college: true }
        }
      }
    });
  }
}
