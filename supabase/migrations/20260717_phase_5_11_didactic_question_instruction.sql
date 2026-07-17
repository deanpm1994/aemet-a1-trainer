alter table public.questions
  add column if not exists selection_instruction text not null default 'as_written'
    check (selection_instruction in ('as_written', 'choose_correct', 'choose_incorrect'));

comment on column public.questions.selection_instruction is
  'Selection rule for reviewed didactic questions; official historic wording remains as_written.';
