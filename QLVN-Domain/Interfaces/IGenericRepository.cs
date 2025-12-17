// QLVN-Domain/Interfaces/IGenericRepository.cs
using System.Linq.Expressions;

namespace QLVN_Domain.Interfaces
{
    public interface IGenericRepository<T> where T : class
    {
        Task<IEnumerable<T>> GetAllAsync();
        Task<T?> GetByIdAsync(object id);
        Task AddAsync(T entity);
        void Update(T entity);
        void Delete(T entity);
        
        Task<IEnumerable<T>> FindAsync(Expression<Func<T, bool>> predicate);
    }
}