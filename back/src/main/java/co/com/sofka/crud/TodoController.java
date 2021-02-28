package co.com.sofka.crud;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.text.ParseException;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
public class TodoController {

    @Autowired
    private TodoService service;

    @Autowired
    private ModelMapper modelMapper;

    @GetMapping(value = "api/todos")
    public List<Dto> list(){
        List<Todo> todos = service.list();
        return todos.stream().map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @PostMapping(value = "api/todo")
    @ResponseBody
    public Dto save( @RequestBody Dto todoDto) throws ParseException {
        Todo todo = convertToEntity(todoDto);
        Todo todoSaved = service.save(todo);
        return convertToDto(todoSaved);
    }

    @PutMapping(value = "api/todo")
    public Dto update(@RequestBody Dto dataDto) throws ParseException {
        Todo todo = convertToEntity(dataDto);
        if(todo.getId() != null){
            return convertToDto(service.save(todo));
        }
        throw new RuntimeException("No existe el id para actualziar");
    }

    @DeleteMapping(value = "api/{id}/todo")
    public void delete(@PathVariable("id")Long id){
        service.delete(id);
    }

    @GetMapping(value = "api/{id}/todo")
    public Dto get(@PathVariable("id") Long id){
        return convertToDto(service.get(id));
    }

    private Dto convertToDto(Todo todo) {
        return modelMapper.map(todo, Dto.class);
    }

    private Todo convertToEntity(Dto todoDto) throws ParseException {
        return modelMapper.map(todoDto, Todo.class);
    }

}
