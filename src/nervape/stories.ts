export class Story {
  //
  chapter = "";
  sequence = "";
  title = "";
  content = "";
  related = [];
  imageUrl = "";
}

export class Chapter {
  name = "";
  stories: Story[] = [];
}
