

let template_parser_re = /(\{\{[^}]+\}\})/g;
export function template(tmpl, values) {
    let parts = tmpl.split(template_parser_re);
    for(let i = 0; i < parts.length; ++i) {
        if(parts[i][0] === '{' && parts[i][1] === '{' && parts[i][parts[i].length-1] === '}' && parts[i][parts[i].length-2] === '}') {
            let name = parts[i].substring(2, parts[i].length - 2).trim();
            parts[i] = '' + values[name];
        }
    }
    return parts.join('');
}