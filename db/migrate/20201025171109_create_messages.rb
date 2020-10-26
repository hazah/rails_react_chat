class CreateMessages < ActiveRecord::Migration[6.0]
  def change
    create_table :messages do |t|
      t.references :user, null: false, foreign_key: true
      t.references :channel, null: false, foreign_key: true
      t.references :reply_to, null: true, foreign_key: { to_table: :messages }
      t.string :content, null: false

      t.timestamps
    end
  end
end
