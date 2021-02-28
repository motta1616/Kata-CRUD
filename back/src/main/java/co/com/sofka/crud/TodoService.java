package co.com.sofka.crud;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import java.util.List;

@Service
public class TodoService {

    @Autowired
    private TodoRepository repository;

    public List<Todo> list(){
        return repository.findAll();
    }

    public Todo save(Todo todo){try {
        validateLength(todo);
    }catch (RuntimeException exception){
        throw new ResponseStatusException(HttpStatus.BAD_REQUEST,exception.getMessage());
    }
        return repository.save(todo);
    }

    private void validateLength(Todo todo) {
        if(todo.getName().length()<3 || todo.getName().length()>100){
            throw new IllegalArgumentException("Se permiten caracteres de 3 hasta 100");
        }
    }

    public void delete(Long id){
        repository.delete(get(id));
    }

    public Todo get(Long id){
         return repository.findById(id).orElseThrow();
    }

}
