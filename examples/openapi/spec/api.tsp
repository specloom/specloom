import "@typespec/http";
import "./models.tsp";

using TypeSpec.Http;

@service({
  title: "Blog API",
})
namespace BlogAPI;

// ============================================================
// REST API 定義
// @typespec/openapi3 エミッターが処理 → OpenAPI YAML
// models.tsp のモデルを共有し、@S.maxLength 等の制約も反映される
// ============================================================

model PostCreate {
  title: Post.title;
  body?: Post.body;
  status?: Post.status;
  authorId: string;
}

model PostUpdate {
  title?: Post.title;
  body?: Post.body;
  status?: Post.status;
}

@route("/posts")
interface Posts {
  @get list(): Post[];
  @get read(@path id: string): Post;
  @post create(@body body: PostCreate): Post;
  @patch update(@path id: string, @body body: PostUpdate): Post;
  @delete remove(@path id: string): void;
}

@route("/users")
interface Users {
  @get list(): User[];
  @get read(@path id: string): User;
}
