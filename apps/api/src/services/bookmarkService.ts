import prisma from "../prisma";

export class BookmarkService {
  static async isBookmarked(userId: string, resourceId: string) {
    const existing = await prisma.bookmark.findUnique({
      where: {
        userId_resourceId: {
          userId,
          resourceId,
        },
      },
    });
    return Boolean(existing);
  }

  static async addBookmark(userId: string, resourceId: string) {
    // Check if resource exists
    const resource = await prisma.resource.findUnique({ where: { id: resourceId } });
    if (!resource) throw new Error("RESOURCE_NOT_FOUND");

    // Check if already bookmarked
    const existing = await prisma.bookmark.findUnique({
      where: {
        userId_resourceId: {
          userId,
          resourceId
        }
      }
    });

    if (existing) {
      return existing; // Already bookmarked, return existing safely
    }

    return prisma.bookmark.create({
      data: {
        userId,
        resourceId
      }
    });
  }

  static async removeBookmark(userId: string, resourceId: string) {
    const existing = await prisma.bookmark.findUnique({
      where: {
        userId_resourceId: {
          userId,
          resourceId
        }
      }
    });

    if (!existing) {
      return true; // already removed
    }

    await prisma.bookmark.delete({
      where: {
        id: existing.id
      }
    });

    return true;
  }

  static async getUserBookmarks(userId: string) {
    const bookmarks = await prisma.bookmark.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        resource: {
          include: {
            subject: { select: { name: true, code: true, department: true } },
            uploadedBy: { select: { username: true } }
          }
        }
      }
    });

    return bookmarks;
  }
}
