class CreatePeers < ActiveRecord::Migration[5.2]
  def change
    create_table :peers do |t|
      t.string :peer
      t.references :user, foreign_key: true
      t.timestamps
    end
  end
end
