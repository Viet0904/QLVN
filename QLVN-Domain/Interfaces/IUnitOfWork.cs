// QLVN-Domain/Interfaces/IUnitOfWork.cs
namespace QLVN_Domain.Interfaces
{
    public interface IUnitOfWork : IDisposable
    {
        IGenericRepository<T> Repository<T>() where T : class;
        Task<int> SaveChangesAsync();
    }
}